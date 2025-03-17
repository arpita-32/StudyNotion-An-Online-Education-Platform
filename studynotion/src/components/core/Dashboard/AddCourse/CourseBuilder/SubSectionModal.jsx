import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { setCourse } from '../../../../../slices/courseSlice';
import toast from 'react-hot-toast';
import {
    createSubSection,
    updateSubSection,
} from '../../../../../services/operations/courseDetailsAPI';
import { RxCross2 } from 'react-icons/rx';
import Upload from '../Upload';
import IconBtn from '../../../../common/IconBtn';

const SubSectionModal = ({ modalData, setmodalData = () => {}, add = false, view = false, edit = false }) => {
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm();

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const { token } = useSelector((state) => state.auth);
    const { course } = useSelector((state) => state.course);

    // Pre-fill form data for view or edit modes
    useEffect(() => {
        if (view || edit) {
            setValue('lectureTitle', modalData.title);
            setValue('lectureDesc', modalData.description);
            setValue('lectureVideo', modalData.videoUrl);
        }
    }, [view, edit, modalData, setValue]);

    // Function to check if form data has been updated in edit mode
    const isFormUpdated = () => {
        const currentValues = getValues();
        return (
            currentValues.lectureTitle !== modalData.title ||
            currentValues.lectureDesc !== modalData.description ||
            currentValues.lectureVideo !== modalData.videoUrl
        );
    };

    // Function to handle edit submission
    const EditSubSectionHandler = async (data) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('sectionId', modalData.sectionId); // Make sure to include sectionId
        formData.append('subSectionId', modalData._id);
        formData.append('title', data.lectureTitle);
        formData.append('description', data.lectureDesc);
        formData.append('courseId', course._id);

        // Only append videoFile if it's a File object (new upload)
        if (data.lectureVideo instanceof File) {
            formData.append('video', data.lectureVideo); // This matches what backend expects
        }

        try {
            const response = await updateSubSection(formData, token);
            if (response) {
                toast.success('Subsection updated successfully');
                dispatch(setCourse(response));
                setmodalData(null); // Close the modal
            }
        } catch (err) {
            console.error('Error updating subsection:', err);
            toast.error('Failed to update subsection');
        } finally {
            setLoading(false);
        }
    };

    // Function to handle form submission
    const submitHandler = async (data) => {
        if (view) return; // Do nothing in view mode

        if (edit) {
            if (!isFormUpdated()) {
                toast.error('No changes made to the form');
                return;
            }
            await EditSubSectionHandler(data);
            return;
        }

        // Create new subsection
        const formData = new FormData();
        formData.append('courseId', course._id);
        formData.append('sectionId', modalData);
        formData.append('title', data.lectureTitle);
        formData.append('description', data.lectureDesc);
        formData.append('video', data.lectureVideo); // This matches what backend expects

        setLoading(true);
        const toastId = toast.loading('Creating SubSection');

        try {
            const result = await createSubSection(formData, token);
            if (result) {
                toast.success('Subsection created successfully');
                dispatch(setCourse(result));
                setmodalData(null); // Close the modal
            }
        } catch (err) {
            console.error('Error creating subsection:', err);
            toast.error('Failed to create subsection');
        } finally {
            toast.dismiss(toastId);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-auto flex justify-center items-center w-screen h-screen backdrop-blur-sm">
            <div className="flex flex-col gap-6 p-7 bg-richblack-800 rounded-lg w-[40%]">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">
                        {view && 'Viewing'} {edit && 'Editing'} {add && 'Adding'} Lecture
                    </h1>
                    <RxCross2
                        size={20}
                        className="cursor-pointer hover:rotate-90 transition-all duration-200"
                        onClick={() => {
                            if (!loading && typeof setmodalData === 'function') {
                                setmodalData(null);
                            }
                        }}
                    />
                </div>

                <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-4">
                    <Upload
                        name="lectureVideo"
                        label="Lecture Video"
                        register={register}
                        setValue={setValue}
                        errors={errors}
                        video={true}
                        viewData={view ? modalData.videoUrl : null}
                        editData={edit ? modalData.videoUrl : null}
                    />

                    <div className="flex flex-col gap-1">
                        <label htmlFor="lectureTitle">
                            Lecture Title <sup className="text-pink-300">*</sup>
                        </label>
                        <input
                            name="lectureTitle"
                            id="lectureTitle"
                            placeholder="Enter Lecture Title"
                            {...register('lectureTitle', { required: true })}
                            className="px-3 py-3 rounded-lg bg-richblack-700 border-b-2 border-b-richblack-600 focus:outline-none"
                            disabled={view}
                        />
                        {errors.lectureTitle && <span className="text-[#D70040]">This field is required</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="lectureDesc">
                            Lecture Description <sup className="text-pink-300">*</sup>
                        </label>
                        <textarea
                            rows={5}
                            name="lectureDesc"
                            id="lectureDesc"
                            placeholder="Enter Lecture Description"
                            {...register('lectureDesc', { required: true })}
                            className="px-3 py-3 rounded-lg bg-richblack-700 border-b-2 border-b-richblack-600 focus:outline-none"
                            disabled={view}
                        />
                        {errors.lectureDesc && <span className="text-[#D70040]">This field is required</span>}
                    </div>

                    {!view && (
                        <div className="flex justify-end items-center gap-4">
                            <button
                                type="button"
                                onClick={() => {
                                    if (typeof setmodalData === 'function') {
                                        setmodalData(null);
                                    }
                                }}
                                className="bg-richblack-600 py-2 px-5 rounded-lg"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <IconBtn
                                text={loading ? 'Loading...' : edit ? 'Save Changes' : 'Save'}
                                type="submit"
                                disabled={loading}
                            />
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default SubSectionModal;