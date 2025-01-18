const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req,res) => {
    try{
        const {sectionName, courseId} = req.body;

        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:'Missing properties',
            });
        }
        
        const newSection = await Section.create({sectionName});

        const updateCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push:{
                    courseContent:newSection._id,
                }
            },
            {new:true},
        );
        return res.status(200).json({
            success:true,
            message:'Section creates successfully',
            updateCourseDetails,
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'unable to create section please try again',
        });
    }
}

exports.updateSection = async (req,res) => {
    try{
        const {sectionName, sectionId} = req.body;

        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:'Missing properties',
            });
        }

        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true});
        return res.status(200).json({
            success:true,
            message:'Section updated successfully',
            
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'unable to update section please try again',
        });
    }
}
exports.deleteSection = async (req,res) => {
    try{
        const {sectionId} = req.params

        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:'Missing properties',
            });
        }

        await Section.findByIdAndDelete(sectionId);
        return res.status(200).json({
            success:true,
            message:'Section delete successfully',
            
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'unable to delete section please try again',
        });
    }
}