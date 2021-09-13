const { 
  client,
  createUser,
  updateUser,
  getAllUsers,
  getUserById,
  createPost,
  updatePost,
  getAllPosts,
  getPostsByUser,
  createTags,
  addTagsToPost,
  getPostsByTagName
} = require('./index');

async function dropTables () {
    try {
        await client.query(`
            DROP TABLE IF EXISTS post_tags;
            DROP TABLE IF EXISTS tags;
            DROP TABLE IF EXISTS posts;
            DROP TABLE IF EXISTS users;
        `)

        console.log("Dropped Tables");
    } catch (error) {
        console.log('Error dropping tables!');
        throw error;
    }
}

async function createTables () {
    try {
        await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL, 
                location VARCHAR(255) NOT NULL,
                active BOOLEAN Default true
            );
            CREATE TABLE posts (
                id SERIAL PRIMARY KEY,
                "authorId" INTEGER REFERENCES users(id) NOT NULL,
                title varchar(255) NOT NULL,
                content TEXT NOT NULL,
                active BOOLEAN DEFAULT true
            );
            CREATE TABLE tags (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL
            );
            CREATE TABLE post_tags (
                "postId" INTEGER REFERENCES users(id),
                "tagId" INTEGER REFERENCES users(id),
                UNIQUE ("postId", "tagId")
            );
        `);
    } catch (error) {
        throw error;
    }
}

async function createInitialUsers() {
    try {
      console.log("Starting to create users...");
  
      const albert = await createUser({ username: 'albert', password: 'bertie99', name: 'albert', location: 'San Jose' });
      const sandra = await createUser({ username: 'sandra', password: '2sandy4me', name: 'sandra', location: 'San Diego'});
      const glamgal = await createUser({ username: 'glamgal', password: 'soglam', name: 'Jessica', location: 'San Francisco'});
  
      console.log("Finished creating users!");
    } catch(error) {
      console.error("Error creating users!");
      throw error;
    }
  }

  async function createInitialPosts() {
    try {
      const [albert, sandra, glamgal] = await getAllUsers();
  
      console.log("Starting to create posts...");
      await createPost({
        authorId: albert.id,
        title: "First Post",
        content: "This is my first post. I hope I love writing blogs as much as I love writing them.",
        tags: ["#happy", "#youcandoanything"]
      });
  
      await createPost({
        authorId: sandra.id,
        title: "How does this work?",
        content: "Seriously, does this even do anything?",
        tags: ["#happy", "#worst-day-ever"]
      });
  
      await createPost({
        authorId: glamgal.id,
        title: "Living the Glam Life",
        content: "Do you even? I swear that half of you are posing.",
        tags: ["#happy", "#youcandoanything", "#canmandoeverything"]
      });
      console.log("Finished creating posts!");
    } catch (error) {
      console.log("Error creating posts!");
      throw error;
    }
  }

async function rebuildDB () {
    try {
        client.connect();
        
        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialPosts();
        await createInitialTags();    
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function testDB() {
  try {
    console.log("Starting to test database...");

    console.log("Calling getAllUsers");
    const users = await getAllUsers();
    console.log("Result:", users);

    console.log("Calling updateUser on users[0]");
    const updateUserResult = await updateUser(users[0].id, {
      name: "Newname Sogood",
      location: "Lesterville, KY"
    });
    console.log("Result:", updateUserResult);

    console.log("Calling getAllPosts");
    const posts = await getAllPosts();
    console.log("Result:", posts);

    console.log("Calling updatePost on posts[0]");
    const updatePostResult = await updatePost(posts[0].id, {
      title: "New Title",
      content: "Updated Content"
    });
    console.log("Result:", updatePostResult);

    console.log("Calling updatePost on posts[1], only updating tags");
  const updatePostTagsResult = await updatePost(posts[1].id, {
    tags: ["#youcandoanything", "#redfish", "#bluefish"]
  });
  console.log("Result:", updatePostTagsResult);

    console.log("Calling getUserById with 1");
    const albert = await getUserById(1);
    console.log("Result:", albert);

    console.log("Calling getPostsByUser with User 1");
    const albertPosts = await getPostsByUser(1);
    console.log("Result:", albertPosts);

    console.log("Calling getPostsByTagName with #happy");
    const postsWithHappy = await getPostsByTagName("#happy");
    console.log("Result:", postsWithHappy);

    console.log("Finished database tests!");
  } catch (error) {
    console.log("Error during testDB");
    throw error;
  }
}


rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());