const jwt = require("jsonwebtoken");

const authenticateAndAuthorization = (requiredRoles)  => {
    return async (req, res, next) => {

        // console.log("1111111")
        try {
        // console.log("222222")

            const token =  req.headers["authorization"] || null;
            // console.log("333333")
        
            if(!token){
        // console.log("4444444")

            return res.status(401).json({Error:"Please Login First"})
        // console.log("5555555")

        }
        // console.log("66666666")

        const decoded = await jwt.verify(token , "weiuw4y5827rwdho2u37825iufhq@#$@#4289e7ekdjq");
        // console.log("\nDecoded User from token:  ",decoded)
        // console.log("77777777")

        if(decoded.User){
        // console.log("88888888")

            req.user = decoded.User;
        // console.log("9999999")

            console.log("\n/n =====> Token User role: ",req.user.role);
        // console.log("1001010101")

        }
        // console.log("011111110")

        if(req.user && requiredRoles && !requiredRoles.includes(req.user.role)){
            console.log("Role Based Access Denied");
            return res.status(403).json({
                Error: "Access Denied: Insufficent Permissions"
            })
        }
        // console.log("12121π21212ß")

        next();
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                console.log("Login First please");
                return res.status(401).json({ message: "Missing Token, Kindly Login first." });

        }
        
    }
} 
}
module.exports = {authenticateAndAuthorization}