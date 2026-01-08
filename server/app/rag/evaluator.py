"""
RAG Evaluation Metrics Module

Provides comprehensive evaluation of RAG system performance including:
- Hallucination detection
- Recall tracking
- Response grounding
- Coverage metrics
"""

import logging
import re
from typing import List, Dict, Any
from difflib import SequenceMatcher

logger = logging.getLogger(__name__)


class RAGEvaluator:
    """Evaluates RAG system responses for quality and accuracy"""
    
    def __init__(self):
        self.min_citation_similarity = 0.7  # Threshold for source matching
    
    def evaluate_response(
        self,
        query: str,
        response: str,
        retrieved_docs: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Comprehensive evaluation of RAG response
        
        Args:
            query: Original user query
            response: Generated LLM response
            retrieved_docs: Documents retrieved from vector store
            
        Returns:
            Dictionary with evaluation metrics
        """
        metrics = {}
        
        # 1. Hallucination Detection
        metrics['hallucination_rate'] = self._detect_hallucination(response, retrieved_docs)
        metrics['is_grounded'] = metrics['hallucination_rate'] < 0.3
        
        # 2. Source Grounding Score
        metrics['grounding_score'] = self._calculate_grounding_score(response, retrieved_docs)
        
        # 3. Recall Metrics
        recall_metrics = self._calculate_recall(query, retrieved_docs)
        metrics.update(recall_metrics)
        
        # 4. Coverage Score
        metrics['coverage_score'] = self._calculate_coverage(query, response)
        
        # 5. Source Usage
        metrics['sources_cited'] = self._count_source_usage(response, retrieved_docs)
        metrics['total_sources'] = len(retrieved_docs)
        metrics['citation_rate'] = (
            metrics['sources_cited'] / metrics['total_sources'] 
            if metrics['total_sources'] > 0 else 0.0
        )
        
        # 6. Overall Quality Score (weighted)
        metrics['quality_score'] = self._calculate_quality_score(metrics)
        
        logger.info(f"Evaluation complete - Quality: {metrics['quality_score']:.2f}, "
                   f"Hallucination: {metrics['hallucination_rate']:.2f}, "
                   f"Recall: {metrics.get('recall_at_5', 0):.2f}")
        
        return metrics
    
    def _detect_hallucination(
        self,
        response: str,
        retrieved_docs: List[Dict[str, Any]]
    ) -> float:
        """
        Detect hallucination by measuring unsupported claims
        
        Returns:
            Hallucination rate (0.0 = no hallucination, 1.0 = complete hallucination)
        """
        if not response or not retrieved_docs:
            return 1.0
        
        # Split response into sentences
        sentences = self._split_into_sentences(response)
        if not sentences:
            return 0.0
        
        # Combine all retrieved document text
        source_text = " ".join([doc.get('text', '') for doc in retrieved_docs])
        
        # Check each sentence for grounding in sources
        grounded_sentences = 0
        for sentence in sentences:
            # Skip very short sentences (like greetings)
            if len(sentence.split()) < 3:
                continue
            
            # Check if sentence content appears in sources (fuzzy match)
            if self._is_grounded_in_sources(sentence, source_text):
                grounded_sentences += 1
        
        total_content_sentences = len([s for s in sentences if len(s.split()) >= 3])
        if total_content_sentences == 0:
            return 0.0
        
        # Hallucination rate = 1 - (grounded sentences / total sentences)
        hallucination_rate = 1.0 - (grounded_sentences / total_content_sentences)
        return round(hallucination_rate, 3)
    
    def _calculate_grounding_score(
        self,
        response: str,
        retrieved_docs: List[Dict[str, Any]]
    ) -> float:
        """
        Calculate how well the response is grounded in retrieved sources
        
        Returns:
            Grounding score (0.0 = not grounded, 1.0 = fully grounded)
        """
        if not response or not retrieved_docs:
            return 0.0
        
        source_text = " ".join([doc.get('text', '') for doc in retrieved_docs])
        
        # Extract key phrases from response (n-grams)
        response_phrases = self._extract_key_phrases(response)
        
        # Count how many key phrases appear in sources
        grounded_phrases = sum(
            1 for phrase in response_phrases
            if phrase.lower() in source_text.lower()
        )
        
        if not response_phrases:
            return 0.5  # Neutral score if no phrases
        
        grounding_score = grounded_phrases / len(response_phrases)
        return round(grounding_score, 3)
    
    def _calculate_recall(
        self,
        query: str,
        retrieved_docs: List[Dict[str, Any]]
    ) -> Dict[str, float]:
        """
        Calculate retrieval recall metrics
        
        Returns:
            Dictionary with recall metrics
        """
        n_results = len(retrieved_docs)
        
        # Recall@K (proportion of relevant docs in top K)
        # We use distance/similarity as relevance indicator
        # Calibration: Many embedding models produce scores in the 0.3-0.6 range for relevant docs
        relevant_threshold = 0.3  # Lowered from 0.7 for better calibration
        
        recall_metrics = {}
        
        if n_results > 0:
            # Calculate average similarity (1 - distance)
            similarities = [1 - doc.get('distance', 1.0) for doc in retrieved_docs]
            
            # Log top K similarities for transparency
            logger.info(f"Retrieval Trace - Top {n_results} Similarities: {[round(s, 3) for s in similarities]}")
            
            recall_metrics['avg_similarity'] = round(sum(similarities) / len(similarities), 3)
            recall_metrics['max_similarity'] = round(max(similarities), 3)
            recall_metrics['min_similarity'] = round(min(similarities), 3)
            
            # Recall@5: proportion of top-5 docs that are relevant
            relevant_count = sum(1 for sim in similarities[:5] if sim >= relevant_threshold)
            recall_metrics['recall_at_5'] = round(relevant_count / min(5, n_results), 3)
            
            # Recall@3
            relevant_count_3 = sum(1 for sim in similarities[:3] if sim >= relevant_threshold)
            recall_metrics['recall_at_3'] = round(relevant_count_3 / min(3, n_results), 3)
            
        else:
            recall_metrics['avg_similarity'] = 0.0
            recall_metrics['max_similarity'] = 0.0
            recall_metrics['min_similarity'] = 0.0
            recall_metrics['recall_at_5'] = 0.0
            recall_metrics['recall_at_3'] = 0.0
        
        return recall_metrics
    
    def _calculate_coverage(self, query: str, response: str) -> float:
        """
        Calculate how well the response covers the query
        
        Returns:
            Coverage score (0.0 = no coverage, 1.0 = full coverage)
        """
        if not query or not response:
            return 0.0
        
        # Extract key terms from query (remove stop words)
        query_terms = self._extract_query_terms(query)
        
        if not query_terms:
            return 0.5
        
        # Count how many query terms appear in response
        response_lower = response.lower()
        covered_terms = sum(1 for term in query_terms if term in response_lower)
        
        coverage = covered_terms / len(query_terms)
        return round(coverage, 3)
    
    def _count_source_usage(
        self,
        response: str,
        retrieved_docs: List[Dict[str, Any]]
    ) -> int:
        """Count how many sources were actually used in the response"""
        if not retrieved_docs:
            return 0
        
        sources_used = 0
        response_lower = response.lower()
        
        for doc in retrieved_docs:
            doc_text = doc.get('text', '')
            # Check if significant chunks of the document appear in response
            doc_phrases = self._extract_key_phrases(doc_text)
            
            phrase_matches = sum(
                1 for phrase in doc_phrases[:5]  # Check top 5 phrases
                if len(phrase) > 10 and phrase.lower() in response_lower
            )
            
            if phrase_matches > 0:
                sources_used += 1
        
        return sources_used
    
    def _calculate_quality_score(self, metrics: Dict[str, Any]) -> float:
        """
        Calculate overall quality score using principled weighted metrics
        
        Formula:
        - Retrieval (0.4): How good the sources were (Recall@5)
        - Grounding (0.4): Answer supported by sources (avg of 1-hal_rate and grounding_score)
        - Quality (0.2): Coverage/Completeness of the answer
        """
        retrieval_score = metrics.get('recall_at_5', 0)
        
        # Grounding is the inverse of hallucination penalty combined with phrase matching
        grounding_score = ((1 - metrics['hallucination_rate']) + metrics['grounding_score']) / 2
        
        # Answer Quality heuristic based on query term coverage
        answer_quality = metrics['coverage_score']
        
        quality = (
            retrieval_score * 0.4 +
            grounding_score * 0.4 +
            answer_quality * 0.2
        )
        
        return round(quality, 3)
    
    # Helper methods
    
    def _split_into_sentences(self, text: str) -> List[str]:
        """Split text into sentences"""
        # Simple sentence splitting on periods, exclamation, question marks
        sentences = re.split(r'[.!?]+', text)
        return [s.strip() for s in sentences if s.strip()]
    
    def _is_grounded_in_sources(self, sentence: str, source_text: str) -> bool:
        """Check if a sentence is grounded in source text using fuzzy matching"""
        sentence_lower = sentence.lower()
        source_lower = source_text.lower()
        
        # Direct substring match
        if sentence_lower in source_lower:
            return True
        
        # Fuzzy match - check if significant portions match
        words = [w for w in sentence_lower.split() if len(w) > 2] # ignore small words
        if len(words) < 3:
            return True  # Too short to evaluate
        
        # 1. Sliding window check
        for window_size in [4, 3]:
            if len(words) >= window_size:
                for i in range(len(words) - window_size + 1):
                    phrase = ' '.join(words[i:i + window_size])
                    if phrase in source_lower:
                        return True
        
        # 2. Keyword density check (if window fails)
        # If at least 40% of unique words in the sentence appear in sources, it's likely grounded
        unique_words = set(words)
        source_words = set(re.findall(r'\b\w+\b', source_lower))
        matches = unique_words.intersection(source_words)
        
        if len(unique_words) > 0 and len(matches) / len(unique_words) >= 0.4:
            return True
            
        return False
    
    def _extract_key_phrases(self, text: str, n: int = 4) -> List[str]:
        """Extract key n-gram phrases from text"""
        words = text.split()
        phrases = []
        
        # Extract 3-grams and 4-grams
        for gram_size in [n, n-1]:
            if len(words) >= gram_size:
                for i in range(len(words) - gram_size + 1):
                    phrase = ' '.join(words[i:i + gram_size])
                    if len(phrase) > 10:  # Only meaningful phrases
                        phrases.append(phrase)
        
        return phrases[:20]  # Return top 20 phrases
    
    def _extract_query_terms(self, query: str) -> List[str]:
        """Extract key terms from query, removing stop words"""
        stop_words = {
            'who', 'what', 'when', 'where', 'why', 'how', 'is', 'the', 'a', 'an',
            'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
            'by', 'from', 'up', 'about', 'into', 'through', 'during', 'are',
            'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does',
            'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
            'can', 'this', 'that', 'these', 'those', 'arsenal', 'tell', 'me'
        }
        
        words = re.findall(r'\b\w+\b', query.lower())
        key_terms = [w for w in words if w not in stop_words and len(w) > 2]
        
        return key_terms


# Global evaluator instance
rag_evaluator = RAGEvaluator()
