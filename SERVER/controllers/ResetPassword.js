const User =  require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");


exports.resetPasswordToken = async (req, res) => {

   try{
    const email = req.body.email;
    const user = await User.findOne({email:email});
    if(!user) {
        return res.json({
            success:fals,
            message:'your email is not registered with us'
        });
    }

    const token = crypto.randomUUID();

    const updatedDetails = await User.findOneAndUpdate(
                                    {email:email},
                                    {
                                        token:token,
                                        resetPasswordExpires: Date.now() + 5*60*1000,
                                    },
                                    {new:true}
    );
    const url = `http://localhost:3000/update-password/${token}`

    await mailSender(email,
        "Password reset link",
        `Password reset link:${url}`
    );

    return res.json({
        success:true,
        message:'email sent successfully,please check email and change pwd',
    });
   }catch(error){
    console.log(error);
    return res.status(500).json({
        success:false,
        message:'something went wrong while reset',
    });
   }
}

exports.resetPassword = async(req,res) => {
    try{
        const {password,confirmPassword,token} = req.body;

        if(password != confirmPassword){
            return res.json({
                success:false,
                message:'password not matching',
            });
        }

        if(!userDetails){
            return res.json({
                success:false,
                message:'Token is invalid',
            });
        }

        if( userDetails.resetPasswordExpires < Date.now()) {
            return res.json({
                success:false,
                message:'token is expired ,please regenerate your token',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true},
        );

        return res.status(200).json({
            success:true,
            message:'password reset successfully',
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'something went wrong',
        });
    }
}