# 🚀 Redis + MongoDB Backend Demo

# Redis is used for

# API caching

# User sessions

# Rate limiting

# MongoDB is the main database

# Redis data can be recreated anytime



# 🔁 Redis Persistence

Redis stores data in memory (RAM), so it is very fast.
Because RAM is temporary, Redis provides persistence to save data on disk.

Persistence helps Redis recover data after restart.



# 💡 Why Persistence Is Needed

Server restart may clear memory

Redis needs a way to save data

Disk storage helps restore data later



# 🗂️ Types of Redis Persistence

# 1️⃣ RDB (Snapshot)

Redis saves data at intervals

Creates a file called dump.rdb

Data is loaded back when Redis restarts

Good for: cache, sessions, temporary data
Downside: some recent data may be lost



# 2️⃣ AOF (Append Only File)

Redis saves every write operation

Replays commands on restart

Good for: more reliable data
Downside: slightly slower and larger file


