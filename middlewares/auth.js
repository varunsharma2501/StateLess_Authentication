const User=require("../models/user")
const {getUser}=require("../service/auth");

async function restrictToLoggedInUser(req,res,next){
    const userUid = req.cookies.uid;
    if (!userUid) {
        return res.redirect("/user/login");
    }

    const decodedToken = getUser(userUid);

    if (!decodedToken || !decodedToken._id) {
        return res.redirect("/user/login");
    }

    // Fetch the complete user object from the database using the _id from the JWT
    const user = await User.findById(decodedToken._id);

    if (!user) {
        return res.redirect("/user/login");
    }

    // Assign the fetched user object to req.user
    req.user = user;
    next();
}

module.exports=restrictToLoggedInUser;