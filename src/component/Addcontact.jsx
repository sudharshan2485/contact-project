import React, {
  useState,
  useEffect,
} from "react";

import axios from "axios";

import {
  db,
  auth,
} from "../Firebase";

import {
  collection,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

import imageCompression from "browser-image-compression";

import "./Addcontact.css";
import "./ContactList.css";

import ss from "../image/uplode.png";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  FaUserAlt,
  FaBars,
  FaSearch,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import {
  MdOutlinePhoneInTalk,
  MdAttachEmail,
} from "react-icons/md";

import {
  IoCalendarNumber,
} from "react-icons/io5";

import {
  BsBuildingsFill,
} from "react-icons/bs";

import {
  FaLocationPinLock,
} from "react-icons/fa6";

import {
  TfiWrite,
} from "react-icons/tfi";

import {
  Plus,
} from "lucide-react";

function ContactForm({
  user,
  logout,
}) {

  const locationData =
    useLocation();

  const navigate =
    useNavigate();

  const editData =
    locationData.state;

  const [sidebar, setSidebar] =
    useState(
      window.innerWidth > 768
    );

  const [form, setForm] =
    useState({
      name: "",
      number: "",
      email: "",
      dob: "",
      job: "",
      location: "",
      notes: "",
      image: null,
    });

  useEffect(() => {

    if (editData) {

      setForm({
        name:
          editData.name || "",
        number:
          editData.number || "",
        email:
          editData.email || "",
        dob:
          editData.dob || "",
        job:
          editData.job || "",
        location:
          editData.location || "",
        notes:
          editData.notes || "",
        image:
          editData.image || "",
      });

    }
  }, [editData]);

  const handleChange = (
    e
  ) => {

    if (
      e.target.name ===
      "image"
    ) {

      setForm({
        ...form,
        image:
          e.target.files[0],
      });

    } else {

      setForm({
        ...form,
        [
          e.target.name
        ]: e.target.value,
      });
    }
  };

  // IMAGE COMPRESS

  const compressImage =
    async (file) => {

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      return await imageCompression(
        file,
        options
      );
    };

  // CLOUDINARY

  const uploadImage =
    async () => {

      if (
        typeof form.image ===
        "string"
      ) {

        return form.image;
      }

      const compressedFile =
        await compressImage(
          form.image
        );

      const data =
        new FormData();

      data.append(
        "file",
        compressedFile
      );

      data.append(
        "upload_preset",
        "google-contect"
      );

      const res =
        await axios.post(
          "https://api.cloudinary.com/v1_1/dlrawqqfh/image/upload",
          data
        );

      return res.data.secure_url;
    };

  // SUBMIT

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      const currentUser =
        auth.currentUser;

      if (!currentUser) {

        return alert(
          "Login First"
        );
      }

      let imageUrl =
        "";

      if (form.image) {

        imageUrl =
          await uploadImage();
      }

      const contactData = {
        ...form,
        image: imageUrl,
        nameLower:
          form.name.toLowerCase(),
        createdAt:
          new Date(),
      };

      try {

        // EDIT

        if (editData) {

          const ref = doc(
            db,
            "users",
            currentUser.uid,
            "contacts",
            editData.id
          );

          await updateDoc(
            ref,
            contactData
          );

          alert(
            "Contact Updated 🔥"
          );

        }

        // CREATE

        else {

          await addDoc(
            collection(
              db,
              "users",
              currentUser.uid,
              "contacts"
            ),
            {
              ...contactData,
              favourite: false,
            }
          );

          alert(
            "Contact Saved 🔥"
          );
        }

        navigate("/");

      } catch (err) {

        console.log(err);

        alert(
          err.message
        );
      }
    };

  return (

    <div className="home-main">

      {/* NAVBAR */}

      <div className="navbar">

        <div className="nav-left">

          <FaBars
            className="nav-icon"
            onClick={() =>
              setSidebar(
                !sidebar
              )
            }
          />

          <h2 className="contact-title">

            {editData
              ? "Edit Contact"
              : "Create Contact"}

          </h2>

          <div className="search-box">

            <FaSearch className="search-icon" />

            <input
              type="text"
              placeholder="Search"
            />

          </div>

        </div>

        <div className="nav-right">

          <FaCog
            className="setting-icon"
            size={22}
          />

          <button
            className="logout-btn"
            onClick={logout}
          >

            <FaSignOutAlt />

            Logout

          </button>

        </div>

      </div>

      {/* BODY */}

      <div className="body-section">

        {/* SIDEBAR */}

        {sidebar && (

          <div className="sidebar">

            <div className="sidebar-profile">

              {user?.photoURL ? (

                <img
                  src={
                    user.photoURL
                  }
                  alt=""
                />

              ) : (

                <div className="profile-letter">

                  {user?.email
                    ?.charAt(0)
                    .toUpperCase()}

                </div>

              )}

              <p>
                {user?.email}
              </p>

            </div>

            <button
              className="create-btn"
              onClick={() =>
                navigate(
                  "/create"
                )
              }
            >

              <Plus />

              Create Contact

            </button>

            <div className="sidebar-menu">

              <p
                onClick={() =>
                  navigate("/")
                }
              >
                All Contacts
              </p>

              <p>
                Favourite
              </p>

              <p>
                Trash
              </p>

            </div>

          </div>

        )}

        {/* FORM */}

        <div
          className={`table-container ${
            sidebar
              ? "small"
              : "full"
          }`}
        >

          <div className="contact_container">

            <div className="form_container">

              <form
                onSubmit={
                  handleSubmit
                }
              >

                {/* IMAGE */}

                <div className="form-cnt1">

                  <label
                    className="custom-file-upload"
                    htmlFor="file-upload"
                  >

                    <span className="upload-icon">

                      {form.image ? (

                        <img
                          src={
                            typeof form.image ===
                            "string"
                              ? form.image
                              : URL.createObjectURL(
                                  form.image
                                )
                          }
                          alt=""
                        />

                      ) : (

                        <img
                          src={ss}
                          alt="Upload"
                        />

                      )}

                    </span>

                    <input
                      id="file-upload"
                      type="file"
                      name="image"
                      onChange={
                        handleChange
                      }
                    />

                  </label>

                </div>

                {/* INPUTS */}

                <div className="form-cnt2">

                  {/* NAME */}

                  <div className="fiest_lable">

                    <i>
                      <FaUserAlt />
                    </i>

                    <input
                      name="name"
                      placeholder="Name"
                      onChange={
                        handleChange
                      }
                      value={
                        form.name
                      }
                      required
                    />

                    <i className="i1">
                      <MdOutlinePhoneInTalk />
                    </i>

                    <input
                      name="number"
                      placeholder="Phone"
                      onChange={
                        handleChange
                      }
                      value={
                        form.number
                      }
                      required
                    />

                  </div>

                  {/* EMAIL */}

                  <div className="fiest_lable">

                    <i>
                      <MdAttachEmail />
                    </i>

                    <input
                      name="email"
                      placeholder="Email"
                      onChange={
                        handleChange
                      }
                      value={
                        form.email
                      }
                    />

                    <i className="i1">
                      <IoCalendarNumber />
                    </i>

                    <input
                      name="dob"
                      type="date"
                      onChange={
                        handleChange
                      }
                      value={
                        form.dob
                      }
                    />

                  </div>

                  {/* JOB */}

                  <div className="fiest_lable">

                    <i>
                      <BsBuildingsFill />
                    </i>

                    <input
                      name="job"
                      placeholder="Job"
                      onChange={
                        handleChange
                      }
                      value={
                        form.job
                      }
                    />

                    <i className="i1">
                      <FaLocationPinLock />
                    </i>

                    <input
                      name="location"
                      placeholder="Location"
                      onChange={
                        handleChange
                      }
                      value={
                        form.location
                      }
                    />

                  </div>

                  {/* NOTES */}

                  <div className="contact_notes">

                    <i>
                      <TfiWrite />
                    </i>

                    <textarea
                      name="notes"
                      placeholder="Notes"
                      onChange={
                        handleChange
                      }
                      value={
                        form.notes
                      }
                    />

                  </div>

                  {/* BUTTON */}

                  <button type="submit">

                    {editData
                      ? "Update Contact"
                      : "Save Contact"}

                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ContactForm;