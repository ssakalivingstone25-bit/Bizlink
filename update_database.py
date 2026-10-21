import sqlite3

connection = sqlite3.connect("instance/bizlink.db")

cursor = connection.cursor()


try:
    cursor.execute(
        "ALTER TABLE user ADD COLUMN approved BOOLEAN DEFAULT 0"
    )
    print("Added approved column")
except:
    print("approved column already exists")


try:
    cursor.execute(
        "ALTER TABLE user ADD COLUMN verified BOOLEAN DEFAULT 0"
    )
    print("Added verified column")
except:
    print("verified column already exists")


try:
    cursor.execute(
        "ALTER TABLE user ADD COLUMN profile_picture TEXT DEFAULT 'default-avatar.png'"
    )
    print("Added profile_picture column")
except:
    print("profile_picture column already exists")


connection.commit()
connection.close()

print("Database update complete")