const getUsers = "SELECT * FROM users";
const getUsersById = "SELECT * FROM users WHERE id = $1";
const checkUsersExist = "SELECT * FROM users WHERE username = $1";
const addUsers = "INSERT INTO users (username, password) VALUES ($1, $2)"
const deleteUsers = "DELETE FROM users WHERE id = $1"
const UpdateUsers = "UPDATE users SET username = $1, password = $2 WHERE id = $3"

const getCountActuality = "SELECT COUNT(*) FROM actuality";
const getActuality = "SELECT * FROM actuality";
// const getActualityTest = "SELECT * FROM actuality_test";
const getActualityByTitle = "SELECT * FROM actuality WHERE title LIKE '%' || $1 || '%'";
// const getActualityByTitleTest = "SELECT * FROM actuality_test WHERE title LIKE '%' || $1 || '%'";
const getActualityById = "SELECT * FROM actuality WHERE id = $1";
// const checkActualityExist = "SELECT s FROM actuality s WHERE s.email = $1";
const addActuality = "INSERT INTO actuality (title, description, link, image, slug, content) VALUES ($1, $2, $3, $4, $5, $6)";
// const addActualityTest = "INSERT INTO actuality_test (title, description, link, image) VALUES ($1, $2, $3, $4)"
const AddActualityById = "INSERT INTO actuality (title, description, link, image) SELECT title, description, link, image FROM actuality WHERE id = $1";
const deleteActuality = "DELETE FROM actuality WHERE id = $1";
const UpdateActuality = "UPDATE actuality SET title = $1 , description = $2, image = $3, slug = $4, content = $5 WHERE id = $6"
const UpdateActualityWithoutImage = "UPDATE actuality SET title = $1 , description = $2, link = $3, slug = $4 WHERE id = $5"
const getActualityBySlug = "SELECT * FROM actuality WHERE slug = $1"

module.exports = {
    getUsers,
    getUsersById,
    checkUsersExist,
    addUsers,
    deleteUsers,
    UpdateUsers,

    getCountActuality,
    getActuality,
    AddActualityById,
    getActualityByTitle,
    // getActualityByTitleTest,
    getActualityById,
    addActuality,
    deleteActuality,
    UpdateActuality,
    UpdateActualityWithoutImage,
    getActualityBySlug,
    // addActualityTest,
    // getActualityTest,
}