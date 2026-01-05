
# The main goal of this app: to have our knowledge base be stored in a db in a semantically searchable way. (read kb + embed + store)

# We have a knowledge base - /arsenal_kb locally
# Step-1: We want to read each content and have that in memory (basically loading text)

# Step-2: Then we chunk that in-memory loaded text in portions
# Then we embed that chunk (meaning change the text into vector representations)

# Step-3: Then store those vector representations in a vector-db supporting db (for our case chroma)