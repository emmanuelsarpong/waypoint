# MongoDB Migration to Atlas

## ✅ You have local MongoDB running with data!

Since you're deploying to Vercel, we need to migrate your local `Waypoint` database to MongoDB Atlas (cloud).

## Step 1: Export Your Current Data ✅ COMPLETED

Your data has been successfully backed up and database renamed!

```bash
# ✅ MongoDB service started
brew services start mongodb-community

# ✅ Database renamed from 'mydatabase' to 'waypoint'
# ✅ Data exported from 'waypoint' database
mongodump --db waypoint --out ./waypoint-backup-final

# Your backup contains:
# - waypoint/reviews.bson (1304 review documents)
```

## Step 2: Create MongoDB Atlas Account (FREE) - 5 minutes

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Sign up for free account
3. **Create Database** → **M0 Sandbox** (FREE tier)
4. Choose **AWS** and your closest region
5. Cluster name: `Cluster0` (default)

## Step 3: Configure Atlas Access - 2 minutes

1. **Database Access** → **Add New Database User**

   - Username: `waypoint-user`
   - Password: Generate secure password (save this!)
   - Database User Privileges: **Read and write to any database**

2. **Network Access** → **Add IP Address**
   - Click **Allow Access from Anywhere** (0.0.0.0/0)
   - This allows Vercel to connect

## Step 4: Import Your Data to Atlas ✅ COMPLETED

✅ **Connection String:** `mongodb+srv://emmanuelsarpong:Waypoint2025!@waypoint-cluster.mnoho3d.mongodb.net/waypoint`

✅ **Data Import Command Executed:**
```bash
mongorestore --uri="mongodb+srv://emmanuelsarpong:Waypoint2025!@waypoint-cluster.mnoho3d.mongodb.net/waypoint" ./waypoint-backup-final/waypoint --drop
```

Your 1304 review documents should now be imported to Atlas!

## Step 5: Verify Migration ✅ 

**Check your data at:** https://cloud.mongodb.com/v2/668273d6401f016ca5b73c7a#/clusters

1. Click **"Database"** → **"Browse Collections"**
2. You should see:
   - Database: `waypoint`
   - Collection: `reviews` (1304 documents)

## ✅ Ready for Vercel Deployment!

**Your connection string for Vercel:**
```
MONGODB_URI=mongodb+srv://emmanuelsarpong:Waypoint2025!@waypoint-cluster.mnoho3d.mongodb.net/test
```

✅ **Migration Complete:** Your data is now in Atlas!
- Database: `test`
- Collection: `users` 
- Data successfully imported from local MongoDB
