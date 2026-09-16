// getting the html elements from role.html into js
const roles_element = document.querySelector(".roles-button");

const assigned_users_main_container = document.querySelector(
  ".assigned-userProfile-mainContainer",
);
const view_details_modal = document.querySelector(".view-details-modal");

const edit_details_modal = document.querySelector(".edit-details-modal");

const delete_details_modal = document.querySelector(".delete-details-modal");

const modal_backdrop = document.querySelector(".modal-backdrop");

const logged_in_user_container = document.querySelector(
  ".logged-in-user-container",
);
const logged_in_user_name = document.querySelector(".logged-in-user-name");

const logout_button = document.querySelector(".logout-button");

// getting the loggedIn user from local storage
const logged_in_user = JSON.parse(localStorage.getItem("loggedInUser"));

// creating user profile on roles.html page by fetching the users API sent from roles routes
function userRolesProfiles(userArray) {
  assigned_users_main_container.innerHTML = "";
  userArray?.forEach((user) => {
    const mainDiv = document.createElement("div");
    mainDiv.classList.add("profile-mainDiv");

    const imageDiv = document.createElement("div");
    imageDiv.classList.add("image-div");

    const imageTag = document.createElement("img");

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
          //   check if teacher is logged in then disable the role select tag
          if (logged_in_user.role === "teacher") {
            role_input.disabled = true;
          }
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
            // add updated email
            formData.append("email", email_input.value);
            // add updated role
            formData.append("role", role_input.value);
            // add updated image
            formData.append("imageFile", image_input.files[0]);

            try {
              const response = await fetch(
                `http://localhost:5500/roles/${user.id}`,
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
              showAssignedUsers();
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
          // reloading the user profile to show users which are not deleted
          showAssignedUsers();
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

    mainDiv.append(
      imageDiv,
      nameTag,
      viewDetails_button,
      edit_button,
      delete_button,
    );

    assigned_users_main_container.append(mainDiv);
  });
}

// function to check for loggedIn user and display in NavBar accordingly
function checkAssignedUserlogin() {
  const logged_in_User_from_local_storage =
    localStorage.getItem("loggedInUser");

  // check if the loggedIn user exists in Local Storage
  if (logged_in_User_from_local_storage) {
    const user = JSON.parse(logged_in_User_from_local_storage);

    // check the user role. On the basis of teacher role and admin role show the roles tab
    if (user.role === "teacher" || user.role === "admin") {
      roles_element.style.display = "flex";
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
    if (logged_in_user_container) {
      logged_in_user_container.style.display = "none";
    }
    roles_element.style.display = "none";
  }
}
checkAssignedUserlogin();

// click event for logout button. It will redirect to index.html page which is the home page
if (logout_button) {
  logout_button.addEventListener("click", () => {
    // remove the loggedIn user from Local Storage
    localStorage.removeItem("loggedInUser");
    // redirect to home page
    window.location.href = "./index.html";
  });
}

// function to get users for Roles tab
async function showAssignedUsers() {
  try {
    const response = await fetch(
      `http://localhost:5500/roles/${logged_in_user.id}/users`,
    );

    if (response.ok) {
      const data = await response.json();
      userRolesProfiles(data);
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.log("error:", error.message);
  }
}
showAssignedUsers();
