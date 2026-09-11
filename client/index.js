// getting the html register user elements into js
const userName = document.getElementById("name");
const userEmail = document.getElementById("email");
const userPassword = document.getElementById("password");
const registerButton = document.querySelector(".registerButton");
const messageStatus = document.querySelector(".messageStatus");
const register_image = document.getElementById("image");

// getting the html login user elements into js
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginButton = document.querySelector(".loginButton");
const loginMessageStatus = document.querySelector(".loginMessageStatus");

// getting the html element from academics page into js
const user_profile_main_container = document.querySelector(
  ".userProfile-mainContainer",
);
const view_details_modal = document.querySelector(".view-details-modal");
const edit_details_modal = document.querySelector(".edit-details-modal");
const delete_details_modal = document.querySelector(".delete-details-modal");
const modal_backdrop = document.querySelector(".modal-backdrop");

// getting the html login, signup, logout and loggedIn user elements into js from navBar
const login_and_signup_container = document.querySelector(
  ".login-and-signup-container",
);
const logged_in_user_container = document.querySelector(
  ".logged-in-user-container",
);
const logged_in_user_name = document.querySelector(".logged-in-user-name");
const logout_button = document.querySelector(".logout-button");

// getting the loggedIn user from local storage
const logged_in_user = JSON.parse(localStorage.getItem("loggedInUser"));

// show status message if all fields are present or not
function showMessage(element, message, isError = false) {
  element.textContent = message;
  element.style.color = isError ? "red" : "green";
}

// click event for register button
if (registerButton) {
  registerButton.addEventListener("click", async () => {
    // const userData = {
    //   name: userName.value,
    //   email: userEmail.value,
    //   role: role_status.value,
    //   image: register_image.files[0].name,
    //   password: userPassword.value,
    // };
    const name = userName.value;
    const email = userEmail.value;
    const imageFile = register_image.files[0];
    const password = userPassword.value;

    // const { name, email, role, password } = userData;

    if (!name || !email || !password || !imageFile) {
      showMessage(messageStatus, "Please fill missing details", true);
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("register-image", imageFile);

    try {
      const response = await fetch("http://localhost:5500/register", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        showMessage(messageStatus, data.message || "Registration Successful");
        // storing the created user in localStorage
        localStorage.setItem("loggedInUser", JSON.stringify(data.user));
        // routing to academics.html page
        window.location.href = "./academics.html";
        console.log("window.location.href:", window.location.href);
        return;
      } else {
        showMessage(messageStatus, data.message || "User already exists", true);
        return;
      }
    } catch (error) {
      console.log("error:", error.message);
    }
  });
}

// click event for login button
if (loginButton) {
  loginButton.addEventListener("click", async () => {
    const userLoginData = {
      email: loginEmail.value,
      password: loginPassword.value,
    };

    const { email, password } = userLoginData;

    if (!email || !password) {
      showMessage(loginMessageStatus, "Please fill the missing details", true);
      return;
    }

    try {
      const response = await fetch("http://localhost:5500/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(userLoginData),
      });
      const data = await response.json();
      // if user does not exists, this conditions satisfies from server if user not created their account
      if (!response.ok) {
        if (response.status === 404) {
          showMessage(
            loginMessageStatus,
            data.message || "Account does not exists",
            true,
          );
          setTimeout(() => {
            window.location.href = "./signup.html";
          }, 1500);
          return;
        }
        if (response.status === 401) {
          showMessage(
            loginMessageStatus,
            data.message || "Invalid email or password",
            true,
          );
          return;
        }
        showMessage(loginMessageStatus, data.message || "Login Failed", true);
        return;
      }

      showMessage(loginMessageStatus, data.message || "Login Successful");
      // check if the admin loggedIn or not, if yses then route to admin.html
      if (data.user.role === "admin") {
        localStorage.setItem("loggedInUser", JSON.stringify(data.user));
        window.location.href = "./admin.html";
        return;
      }

      // store logged in user
      localStorage.setItem("loggedInUser", JSON.stringify(data.user));
      // redirect to academics.html page
      window.location.href = "./academics.html";
    } catch (error) {
      console.log("error:", error.message);
    }
  });
}

// creating user profile on academics.html page by fetching the users API sent from server
function userProfiles(userArray) {
  user_profile_main_container.innerHTML = "";
  userArray?.forEach((user) => {
    const mainDiv = document.createElement("div");
    mainDiv.classList.add("profile-mainDiv");

    const imageDiv = document.createElement("div");
    imageDiv.classList.add("image-div");

    const imageTag = document.createElement("img");
    // imageTag.src = `http://localhost:5500/uploads/${user.image}`;
    imageTag.src = `../server/fileUploads/${user.image}`;

    imageDiv.append(imageTag);

    const nameTag = document.createElement("h3");
    nameTag.textContent = user.name;
    nameTag.classList.add("name-tag-userProfile");

    // View functionality
    const viewDetails_button = document.createElement("button");
    viewDetails_button.textContent = "View Details";

    // click event for view details button
    viewDetails_button.addEventListener("click", async () => {
      view_details_modal.innerHTML = "";

      // show view details modal
      view_details_modal.style.display = "block";
      modal_backdrop.style.display = "block";

      // this will add the id of the user in query parameter
      history.pushState({}, "", `?id=${user.id}`);
      // requesting the server by sending the id of the user and getting the user in response so that we always get the updated user data
      try {
        const response = await fetch(
          `http://localhost:5500/academics/${user.id}`,
          {
            method: "POST",
            body: `${user.id}`,
          },
        );
        const userResponse = await response.json();

        if (response.ok) {
          // name label
          const name_card_tag = document.createElement("p");
          name_card_tag.textContent = "Name";
          // name input
          const name_input = document.createElement("input");
          name_input.type = "text";
          name_input.value = userResponse.name;
          name_input.readOnly = true;
          // email label
          const email_card_tag = document.createElement("p");
          email_card_tag.textContent = "Email";
          // email input
          const email_input = document.createElement("input");
          email_input.type = "email";
          email_input.value = userResponse.email;
          email_input.readOnly = true;
          // role label
          const role_card_tag = document.createElement("p");
          role_card_tag.textContent = "Role";
          // role input
          const role_input = document.createElement("input");
          role_input.type = "text";
          role_input.value = userResponse.role;
          role_input.readOnly = true;
          const cancel_button = document.createElement("button");
          //   click event for cancel button
          cancel_button.addEventListener("click", () => {
            view_details_modal.style.display = "none";
            modal_backdrop.style.display = "none";
          });
          view_details_modal.append(
            name_card_tag,
            name_input,
            email_card_tag,
            email_input,
            role_card_tag,
            role_input,
            cancel_button,
          );
        }
      } catch (error) {
        showMessage(messageStatus, data.message, true);
      }
    });
    // Edit functionality to edit name, role and image
    const edit_button = document.createElement("button");
    edit_button.textContent = "Edit";
    // click event for edit button
    edit_button.addEventListener("click", async () => {
      edit_details_modal.innerHTML = "";
      edit_details_modal.style.display = "block";
      modal_backdrop.style.display = "block";

      // this will add the id of the user in query parameter
      history.pushState({}, "", `?id=${user.id}`);
      // requesting the server by sending the id of the user and getting the user in response so that we always get the updated user data
      try {
        const response = await fetch(
          `http://localhost:5500/academics/${user.id}`,
          {
            method: "POST",
            body: `${user.id}`,
          },
        );
        const userEditResponse = await response.json();
        if (response.ok) {
          // image label
          const image_card_tag = document.createElement("p");
          image_card_tag.textContent = "Image";
          // image input
          const image_input = document.createElement("input");
          image_input.type = "file";
          image_input.name = "imageFile";
          image_input.id = "imageFile-input";
          image_input.accept = "image/*";
          // name label
          const name_card_tag = document.createElement("p");
          name_card_tag.textContent = "Name";
          // name input
          const name_input = document.createElement("input");
          name_input.type = "text";
          name_input.value = userEditResponse.name;
          // email label
          const email_card_tag = document.createElement("p");
          email_card_tag.textContent = "Email";
          // email input
          const email_input = document.createElement("input");
          email_input.type = "email";
          email_input.value = userEditResponse.email;
          email_input.readOnly = true;
          // role label
          const role_card_tag = document.createElement("p");
          role_card_tag.textContent = "Role";
          // role input
          const role_input = document.createElement("select");
          role_input.classList.add("role-input");
          // student option
          const student_option = document.createElement("option");
          student_option.value = "student";
          student_option.textContent = "Student";
          // Teacher option
          const teacher_option = document.createElement("option");
          teacher_option.value = "teacher";
          teacher_option.textContent = "Teacher";
          role_input.append(student_option, teacher_option);
          role_input.value = userEditResponse.role;
          // cancel button
          const cancel_button = document.createElement("button");
          //   click event for cancel button
          cancel_button.addEventListener("click", () => {
            edit_details_modal.style.display = "none";
            modal_backdrop.style.display = "none";
          });
          // save button to save changes after edit and update
          const save_button = document.createElement("button");
          save_button.textContent = "Save";
          // click event for save button
          save_button.addEventListener("click", async () => {
            const formData = new FormData();
            // add updated name
            formData.append("name", name_input.value);
            // add updated role
            formData.append("role", role_input.value);
            // add updated image
            formData.append("imageFile", image_input.files[0]);

            try {
              const response = await fetch(
                `http://localhost:5500/users/${user.id}`,
                {
                  method: "PUT",
                  body: formData,
                },
              );
              const data = await response.json();
              if (!response.ok) {
                throw new Error(data.message || "Failed to update user");
              }
              // close modal
              edit_details_modal.style.display = "none";
              modal_backdrop.style.display = "none";
              // reload the user profile grid function
              showUserProfile();
            } catch (error) {
              console.log("error:", error.message);
            }
          });

          edit_details_modal.append(
            image_card_tag,
            image_input,
            name_card_tag,
            name_input,
            email_card_tag,
            email_input,
            role_card_tag,
            role_input,
            cancel_button,
            save_button,
          );
        }
      } catch (error) {
        console.log("error:", error.message);
      }
    });
    // Delete functionality
    const delete_button = document.createElement("button");
    delete_button.textContent = "Delete";
    // click event for delete button
    delete_button.addEventListener("click", () => {
      delete_details_modal.style.display = "block";
      modal_backdrop.style.display = "block";
      // delete particular user text
      const delete_user_text = document.createElement("p");
      delete_user_text.textContent = `Are you sure you want to delete user-${user.name}`;
      // confirm button
      const confirm_delete_button = document.createElement("button");
      confirm_delete_button.textContent = "Confirm";
      // click event for confirm delete button
      confirm_delete_button.addEventListener("click", async () => {
        try {
          const response = await fetch(
            `http://localhost:5500/users/${user.id}`,
            {
              method: "DELETE",
            },
          );
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || "Failed to delete user");
          }
          // relaoding the user profile to show users which are not deleted
          showUserProfile();
        } catch (error) {
          console.log("error:", error.message);
        }
      });
      // cancel delete button
      const cancel_delete_user_button = document.createElement("button");
      cancel_delete_user_button.textContent = "Cancel";
      // click event for cancel delete user button
      cancel_delete_user_button.addEventListener("click", () => {
        delete_details_modal.innerHTML = "";
        delete_details_modal.style.display = "none";
        modal_backdrop.style.display = "none";
      });
      delete_details_modal.append(
        delete_user_text,
        confirm_delete_button,
        cancel_delete_user_button,
      );
    });

    if (logged_in_user.role === "teacher") {
      mainDiv.append(imageDiv, nameTag, viewDetails_button, edit_button);
    } else {
      mainDiv.append(imageDiv, nameTag, viewDetails_button);
    }
    user_profile_main_container.append(mainDiv);
  });
}

// function to check academics login whether it is a logged in user or new user. If not logged in then redirect to login.html page and if doesn't have creds then redirect to signup.html page. It detects by the element (user_profile_main_container) which HTML page to load, that's why when clicked on academics it redirects to login page
function checkcAcademicsLogin() {
  const logged_in_user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!logged_in_user && user_profile_main_container) {
    window.location.href = "./login.html";
  }
}
checkcAcademicsLogin();

// function to check for loggedIn user and display in NavBar accordingly
function checkUserlogin() {
  const logged_in_User_from_local_storage =
    localStorage.getItem("loggedInUser");

  // check if the loggedIn user exists in Local Storage
  if (logged_in_User_from_local_storage) {
    const user = JSON.parse(logged_in_User_from_local_storage);

    // make the login and signUp container display to none
    if (login_and_signup_container) {
      login_and_signup_container.style.display = "none";
    }
    // make the loggedIn user container display to flex, as it will have both loggedIn username and logout button
    if (logged_in_user_container) {
      logged_in_user_container.style.display = "flex";
    }
    // assign the name to the loggedIn user Span element
    if (logged_in_user_name) {
      logged_in_user_name.textContent = user.name;
    }
  } else {
    // check if the loggedIn user doesn't exists in Local Storage
    if (login_and_signup_container) {
      login_and_signup_container.style.display = "flex";
    }
    if (logged_in_user_container) {
      logged_in_user_container.style.display = "none";
    }
  }
}
checkUserlogin();

// click event for logout button. It will redirect to index.html page which is the home page
if (logout_button) {
  logout_button.addEventListener("click", () => {
    // remove the loggedIn user from Local Storage
    localStorage.removeItem("loggedInUser");
    // redirect to home page
    window.location.href = "./index.html";
  });
}

// function to show all the userProfiles in grid
async function showUserProfile() {
  try {
    const response = await fetch("http://localhost:5500/academics/users");

    if (response.ok) {
      const data = await response.json();
      userProfiles(data);
    } else {
      throw new Error(data.message || "Error loading User profiles");
    }
  } catch (error) {
    console.log("error:", error);
  }
}
showUserProfile();
