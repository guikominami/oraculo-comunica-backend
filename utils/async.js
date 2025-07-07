function testAsync() {
   console.log("Before");

   getUser(1, (user) => {
      getUserRepositories(user.userName, (repo) => {
         console.log("repo", repo);
      });
   });

   console.log("after");
}

function getUser(id, callback) {
   setTimeout(() => {
      console.log("Reading a user from database...");

      callback({ id: id, userName: "Gui" });
   }, 2000);
}

function getUserRepositories(userName, callback) {
   setTimeout(() => {
      console.log("Reading the repositories from database...");
      callback[("repo1", "repo2", "repo2")];
   }, 2000);
}

module.exports = testAsync;
