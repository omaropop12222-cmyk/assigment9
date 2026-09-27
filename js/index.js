//  close & open form
var addBtn = document.getElementById("addBtn");
var closeBtn = document.getElementById("closeBtn");
var myModal = document.getElementById("myModal");
var cancelBtn = document.getElementById("cancelBtn");

addBtn.addEventListener("click", function () {
  myModal.querySelector("h2").innerHTML = "Add New Contact";
  myModal.classList.add("active");
});

closeBtn.addEventListener("click", function () {
  closeModal();
});

cancelBtn.addEventListener("click", function () {
  closeModal();
});
myModal.addEventListener("click", function (e) {
  if (e.target === myModal) {
    closeModal();
  }
});
function closeModal() {
  clear();
  removeIsValid();

  favCheck.checked = false;
  emergencyCheck.checked = false;

  isEditing = false;
  myModal.classList.remove("active");
}
// get inputs
var contactNameInput = document.getElementById("contactName");
var contactPhoneInput = document.getElementById("contactPhone");
var contactEmailInput = document.getElementById("contactEmail");
var contactAddressInput = document.getElementById("contactAddress");
var contactGroupInput = document.getElementById("contactGroup");
var contactSearchInput = document.getElementById("contactSearch");
var contactPhotoInput = document.getElementById("contactPhoto");
var favCheck = document.getElementById("favCheck");
var emergencyCheck = document.getElementById("emergencyCheck");
var contactNotes = document.getElementById("contactNotes");
// array of contacts
var contactList;
var myIndex;
if (localStorage.getItem("contacts") == null) {
  contactList = [];
} else {
  contactList = JSON.parse(localStorage.getItem("contacts"));
}
//regex
var regexRules = {
  contactName: /^[A-Za-z\u0600-\u06FF ]{2,50}$/,
  contactPhone: /^(010|011|012|015)[0-9]{8}$/,
  contactEmail: /^\w{1,10}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
};
// colours
var avatarColors = [
  "linear-gradient(135deg, #4facfe 0%, #2f6bff 100%)",
  "linear-gradient(135deg, #ff9a56 0%, #ff6a00 100%)",
  "linear-gradient(135deg, #f857a6 0%, #e91e8c 100%)",
];
// random colour
function getRandomColor() {
  var index = Math.floor(Math.random() * avatarColors.length);
  return avatarColors[index];
}
// check function
function checkContactData(excludeIndex) {
  var name = contactNameInput.value;
  var phone = contactPhoneInput.value;
  var email = contactEmailInput.value;
  // missing name
  if (name === "") {
    Swal.fire({
      icon: "error",
      title: "Missing Name",
      text: "Please enter a name for the contact!",
      confirmButtonColor: "#7f22fe",
    });
    return false;
  }

  // Invalid Name
  if (!regexRules.contactName.test(name)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Name",
      text: "Name should contain only letters and spaces (2-50 characters)",
      confirmButtonColor: "#7f22fe",
    });
    return false;
  }
  // Missing Phone
  if (phone === "") {
    Swal.fire({
      icon: "error",
      title: "Missing Phone",
      text: "Please enter a phone number!",
      confirmButtonColor: "#7f22fe",
    });
    return false;
  }
  // invalid phone
  if (!regexRules.contactPhone.test(phone)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Phone",
      text: "Please enter a valid Egyptian phone number",
      confirmButtonColor: "#7f22fe",
    });
    return false;
  }
  // missing email
  if (email === "") {
    Swal.fire({
      icon: "error",
      title: "Missing Email",
      text: "Please enter an email address",
      confirmButtonColor: "#7f22fe",
    });
    return false;
  }
  // Invalid Email
  if (!regexRules.contactEmail.test(email)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Email",
      text: "Please enter a valid email address",
      confirmButtonColor: "#7f22fe",
    });
    return false;
  }
  //  Duplicate Phone Number check (skip the contact being edited)
  for (var i = 0; i < contactList.length; i++) {
    if (i === excludeIndex) {
      continue;
    }
    if (contactList[i].phone === phone) {
      Swal.fire({
        icon: "error",
        title: "Duplicate Phone Number",
        text:
          "A contact with this phone number already exists: " +
          contactList[i].name,
        confirmButtonColor: "#7f22fe",
      });
      return false;
    }
  }
  return true;
}
// function of add contacts
function addContacts() {
  if (!checkContactData(-1)) {
    return;
  }
  var contact = {
    name: contactNameInput.value,
    phone: contactPhoneInput.value,
    email: contactEmailInput.value,
    address: contactAddressInput.value,
    group: contactGroupInput.value,
    img: contactPhotoInput.files[0]
      ? `images/${contactPhotoInput.files[0].name}`
      : null,
    avatarColor: getRandomColor(),
    notes: contactNotes.value,
  };
  contactList.push(contact);
  if (favCheck.checked) {
    favouriteList.push(contact);
  }

  if (emergencyCheck.checked) {
    emergencyList.push(contact);
  }
  localStorage.setItem("contacts", JSON.stringify(contactList));
  localStorage.setItem("favouriteContacts", JSON.stringify(favouriteList));
  localStorage.setItem("emergencyContacts", JSON.stringify(emergencyList));

  display();
  displayFav();
  displayEmergency();
  updateCounters();
  closeModal();
  Swal.fire({
    icon: "success",
    title: "Added",
    text: "Contact Saved successfully!",
    timer: 1500,
    showConfirmButton: false,
  });
}
// clear function
function clear() {
  contactNameInput.value = null;
  contactPhoneInput.value = null;
  contactEmailInput.value = null;
  contactAddressInput.value = null;
  contactGroupInput.value = "";
  contactPhotoInput.value = null;
  favCheck.checked = false;
  emergencyCheck.checked = false;
  contactNotes.value = "";
}
// display function

function display() {
  var cartona = "";
  for (var i = 0; i < contactList.length; i++) {
    var firstChar = contactList[i].name.charAt(0).toUpperCase();
    var groupHTML = "";
    if (contactList[i].group && contactList[i].group !== "Select a group") {
      var groupClass = getGroupClass(contactList[i].group);
      groupHTML = `<div class="group ${groupClass}">${contactList[i].group}</div>`;
    }
    cartona += `
      <div class="col-md-6 col-12 card-contact" id="card-${i}" >
        <div class="upper">
          <div class="line1 d-flex gap-3 align-items-center">
<div class="left" style="background: ${contactList[i].avatarColor || avatarColors[0]}">${contactList[i].img ? `<img src="${contactList[i].img}" style="width:100%;height:100%;object-fit:cover;border-radius:16px;">` : firstChar}
<span class="star-badge ${favouriteList.indexOf(contactList[i]) !== -1 ? "" : "d-none"}"><i class="fa-solid fa-star"></i></span>
  <span class="heart-badge ${emergencyList.indexOf(contactList[i]) !== -1 ? "" : "d-none"}"><i class="fa-solid fa-heart-pulse"></i></span>
            </div> 
            <div class="right">
              <h3>${contactList[i].name}</h3>
              <div class="low d-flex gap-3 ">
                <div class="phone-icon"><i class="fa-solid fa-phone"></i></div>
                <p>${contactList[i].phone}</p>
              </div>
            </div>
          </div>
          <div class="line2  d-flex gap-2">
            <div class="envelop-icon"><i class="fa-solid fa-envelope"></i></div>
            <p>${contactList[i].email}</p>
          </div>
          <div class="line3  d-flex gap-2">
            <div class="gps"><i class="fa-solid fa-location-dot"></i></div>
            <p>${contactList[i].address}</p>
          </div>
          <div class="line4">
            ${groupHTML}
<div class="emergency-tag ${emergencyList.indexOf(contactList[i]) !== -1 ? "" : "d-none"}"><i class="fa-solid fa-heart-pulse"></i> Emergency</div>
          </div>
        </div>
        <div class="lower-part d-flex justify-content-between align-items-center">
          <div class="left d-flex gap-2">
<a href="tel:${contactList[i].phone}" class="phone-icon-btn"><i class="fa-solid fa-phone"></i></a>
<a href="mailto:${contactList[i].email}" class="envelop-icon-btn" title="Email"><i class="fa-solid fa-envelope"></i></a>
          </div>
          <div class="right">
<button class="star-btn ${favouriteList.indexOf(contactList[i]) !== -1 ? "star-static" : ""}" onclick="favourite(${i},this)"><i class="fa-${favouriteList.indexOf(contactList[i]) !== -1 ? "solid" : "regular"} fa-star"></i></button>
<button class="heart-btn ${emergencyList.indexOf(contactList[i]) !== -1 ? "heart-static" : ""}" onclick="emergency(${i},this)"><i class="${emergencyList.indexOf(contactList[i]) !== -1 ? "fa-solid fa-heart-pulse" : "fa-regular fa-heart"}"></i></button>
<button class="edit" onclick="edit(${i})"><i class="fa-solid fa-pen"></i></button>
<button class="delete" onclick="Delete(${i})"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      </div>
    `;
  }
  if (cartona === "") {
    document.getElementById("myRow").innerHTML =
      `<div class="contacts text-center">
  <div class="icon">
    <i class="fa-solid fa-address-book"></i>
  </div>
  <h3>No contacts found</h3>
  <p>Click "Add Contact" to get started</p>
</div>`;
  } else {
    document.getElementById("myRow").innerHTML = cartona;
  }
}
// delete function
function Delete(deletedIndex) {
  var deletedContact = contactList[deletedIndex];
  Swal.fire({
    icon: "warning",
    title: "Delete Contact?",
    text:
      "Are you sure you want to delete " +
      deletedContact.name +
      "? This action cannot be undone.",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
  }).then((result) => {
    if (result.isConfirmed) {
      // delete from favouriteList
      for (var i = 0; i < favouriteList.length; i++) {
        if (favouriteList[i].phone == deletedContact.phone) {
          favouriteList.splice(i, 1);
          break;
        }
      }

      // delete from emergencyList
      for (var i = 0; i < emergencyList.length; i++) {
        if (emergencyList[i].phone == deletedContact.phone) {
          emergencyList.splice(i, 1);
          break;
        }
      }
      contactList.splice(deletedIndex, 1);
      localStorage.setItem("contacts", JSON.stringify(contactList));
      localStorage.setItem("favouriteContacts", JSON.stringify(favouriteList));
      localStorage.setItem("emergencyContacts", JSON.stringify(emergencyList));

      display();
      displayFav();
      displayEmergency();
      updateCounters();
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Contact Deleted successfully!",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  });
}
// search function
function search() {
  var word = contactSearchInput.value;
  var cartona = "";
  for (var i = 0; i < contactList.length; i++) {
    if (
      contactList[i].name.toLowerCase().includes(word.toLowerCase()) ||
      contactList[i].phone.toLowerCase().includes(word.toLowerCase()) ||
      contactList[i].email.toLowerCase().includes(word.toLowerCase())
    ) {
      var firstChar = contactList[i].name.charAt(0).toUpperCase();
      var groupHTML = "";
      if (contactList[i].group && contactList[i].group !== "Select a group") {
        var groupClass = getGroupClass(contactList[i].group);
        groupHTML = `<div class="group ${groupClass}">${contactList[i].group}</div>`;
      }
      cartona += `
      <div class="col-md-6 col-12 card-contact" id="card-${i}">
        <div class="upper">
          <div class="line1 d-flex gap-3 align-items-center">
<div class="left" style="background: ${contactList[i].avatarColor || avatarColors[0]}">${contactList[i].img ? `<img src="${contactList[i].img}" style="width:100%;height:100%;object-fit:cover;border-radius:16px;">` : firstChar}
<span class="star-badge ${favouriteList.indexOf(contactList[i]) !== -1 ? "" : "d-none"}"><i class="fa-solid fa-star"></i></span>
  <span class="heart-badge ${emergencyList.indexOf(contactList[i]) !== -1 ? "" : "d-none"}"><i class="fa-solid fa-heart-pulse"></i></span>
            </div>
            <div class="right">
              <h3>${contactList[i].name}</h3>
              <div class="low d-flex gap-3 ">
                <div class="phone-icon"><i class="fa-solid fa-phone"></i></div>
                <p>${contactList[i].phone}</p>
              </div>
            </div>
          </div>
          <div class="line2  d-flex gap-2">
            <div class="envelop-icon"><i class="fa-solid fa-envelope"></i></div>
            <p>${contactList[i].email}</p>
          </div>
          <div class="line3  d-flex gap-2">
            <div class="gps"><i class="fa-solid fa-location-dot"></i></div>
            <p>${contactList[i].address}</p>
          </div>
          <div class="line4">
            ${groupHTML}
<div class="emergency-tag ${emergencyList.indexOf(contactList[i]) !== -1 ? "" : "d-none"}"><i class="fa-solid fa-heart-pulse"></i> Emergency</div>
          </div>
        </div>
        <div class="lower-part d-flex justify-content-between align-items-center">
          <div class="left d-flex gap-2">
     <a href="tel:${contactList[i].phone}" class="phone-icon-btn"><i class="fa-solid fa-phone"></i></a>
<a href="mailto:${contactList[i].email}" class="envelop-icon-btn" title="Email"><i class="fa-solid fa-envelope"></i></a>
          </div>
          <div class="right">
<button class="star-btn ${favouriteList.indexOf(contactList[i]) !== -1 ? "star-static" : ""}" onclick="favourite(${i},this)"><i class="fa-${favouriteList.indexOf(contactList[i]) !== -1 ? "solid" : "regular"} fa-star"></i></button>
<button class="heart-btn ${emergencyList.indexOf(contactList[i]) !== -1 ? "heart-static" : ""}" onclick="emergency(${i},this)"><i class="${emergencyList.indexOf(contactList[i]) !== -1 ? "fa-solid fa-heart-pulse" : "fa-regular fa-heart"}"></i></button>
<button class="edit" onclick="edit(${i})"><i class="fa-solid fa-pen"></i></button>
<button class="delete" onclick="Delete(${i})"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      </div>
    `;
    }
  }
  if (cartona === "") {
    document.getElementById("myRow").innerHTML =
      `<div class="contacts text-center">
  <div class="icon">
    <i class="fa-solid fa-address-book"></i>
  </div>
  <h3>No contacts found</h3>
  <p>Click "Add Contact" to get started</p>
</div>`;
  } else {
    document.getElementById("myRow").innerHTML = cartona;
  }
}
//validation function
function validation(element) {
  var regex = {
    contactName: /^[A-Za-z\u0600-\u06FF ]{2,50}$/,
    contactPhone: /^(010|011|012|015)[0-9]{8}$/,
    contactEmail: /^\w{1,10}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  };
  var result = regex[element.id].test(element.value);
  if (result == true) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
    element.nextElementSibling.classList.add("d-none");
  } else {
    element.classList.remove("is-valid");
    element.classList.add("is-invalid");
    element.nextElementSibling.classList.remove("d-none");
  }
}
//add is-valid
function addIsValid() {
  contactNameInput.classList.add("is-valid");
  contactPhoneInput.classList.add("is-valid");
  contactEmailInput.classList.add("is-valid");
}
// remove is valid
function removeIsValid() {
  contactNameInput.classList.remove("is-valid");
  contactPhoneInput.classList.remove("is-valid");
  contactEmailInput.classList.remove("is-valid");
}
var isEditing = false;
//edit function
function edit(index) {
  myIndex = index;
  contactNameInput.value = contactList[index].name;
  contactPhoneInput.value = contactList[index].phone;
  contactEmailInput.value = contactList[index].email;
  contactAddressInput.value = contactList[index].address;
  contactGroupInput.value = contactList[index].group;
  contactNotes.value = contactList[index].notes;
  favCheck.checked = false;
  emergencyCheck.checked = false;

  for (var i = 0; i < favouriteList.length; i++) {
    if (favouriteList[i].phone == contactList[index].phone) {
      favCheck.checked = true;
      break;
    }
  }

  for (var i = 0; i < emergencyList.length; i++) {
    if (emergencyList[i].phone == contactList[index].phone) {
      emergencyCheck.checked = true;
      break;
    }
  }
  addIsValid();
  isEditing = true;
  myModal.querySelector("h2").innerHTML = "Edit Contact";
  myModal.classList.add("active");
}
// update function
function update() {
  if (!checkContactData(myIndex)) {
    return;
  }
  contactList[myIndex].name = contactNameInput.value;
  contactList[myIndex].phone = contactPhoneInput.value;
  contactList[myIndex].email = contactEmailInput.value;
  contactList[myIndex].address = contactAddressInput.value;
  contactList[myIndex].group = contactGroupInput.value;
  contactList[myIndex].notes = contactNotes.value;

  // Favourite
  var favIndex = favouriteList.indexOf(contactList[myIndex]);

  if (favCheck.checked && favIndex == -1) {
    favouriteList.push(contactList[myIndex]);
  } else if (!favCheck.checked && favIndex != -1) {
    favouriteList.splice(favIndex, 1);
  }

  // Emergency
  var emergencyIndex = emergencyList.indexOf(contactList[myIndex]);

  if (emergencyCheck.checked && emergencyIndex == -1) {
    emergencyList.push(contactList[myIndex]);
  } else if (!emergencyCheck.checked && emergencyIndex != -1) {
    emergencyList.splice(emergencyIndex, 1);
  }
  // save photo
  if (contactPhotoInput.files[0]) {
    contactList[myIndex].img = `images/${contactPhotoInput.files[0].name}`;
  }

  localStorage.setItem("contacts", JSON.stringify(contactList));
  localStorage.setItem("favouriteContacts", JSON.stringify(favouriteList));
  localStorage.setItem("emergencyContacts", JSON.stringify(emergencyList));
  display();
  displayFav();
  displayEmergency();
  updateCounters();
  closeModal();
  Swal.fire({
    icon: "success",
    title: "Updated ",
    text: "Contact Updated successfully!",
    timer: 1500,
    showConfirmButton: false,
  });
}
// saveContact action function
function saveContact() {
  if (isEditing == true) {
    update();
  } else {
    addContacts();
  }
}
//counterTotal
var firstLine = document.getElementById("first-line");

// selectedGroup
function getGroupClass(group) {
  if (group === "Work") {
    return "group-work";
  } else if (group === "School") {
    return "group-school";
  } else if (group === "Family") {
    return "group-family";
  } else if (group === "Friends") {
    return "group-friends";
  } else {
    return "group-other";
  }
}
//favouriteList & function & counter
var favouriteList;
if (localStorage.getItem("favouriteContacts") == null) {
  favouriteList = [];
} else {
  favouriteList = JSON.parse(localStorage.getItem("favouriteContacts"));
  for (var i = 0; i < favouriteList.length; i++) {
    for (var j = 0; j < contactList.length; j++) {
      if (contactList[j].phone === favouriteList[i].phone) {
        favouriteList[i] = contactList[j];
      }
    }
  }
}
firstLine.querySelector(".counterFav").innerHTML = favouriteList.length;
function favourite(favIndex, btn) {
  var card = document.getElementById("card-" + favIndex);
  var starBadge = card.querySelector(".star-badge");
  if (btn.classList.contains("star-static")) {
    btn.classList.remove("star-static");
    starBadge.classList.add("d-none");
    // index in FAvList
    var itemIndex = favouriteList.indexOf(contactList[favIndex]);
    favouriteList.splice(itemIndex, 1);
  } else {
    favouriteList.push(contactList[favIndex]);
    btn.classList.add("star-static");
    starBadge.classList.remove("d-none");
  }

  localStorage.setItem("favouriteContacts", JSON.stringify(favouriteList));
  firstLine.querySelector(".counterFav").innerHTML = favouriteList.length;
  displayFav();
}
//emergencyList & function & counter
var emergencyList;
if (localStorage.getItem("emergencyContacts") == null) {
  emergencyList = [];
} else {
  emergencyList = JSON.parse(localStorage.getItem("emergencyContacts"));
  for (var i = 0; i < emergencyList.length; i++) {
    for (var j = 0; j < contactList.length; j++) {
      if (contactList[j].phone === emergencyList[i].phone) {
        emergencyList[i] = contactList[j];
      }
    }
  }
}
firstLine.querySelector(".counterEmergency").innerHTML = emergencyList.length;
function emergency(emrgencyIdx, btn) {
  var card = document.getElementById("card-" + emrgencyIdx);
  var heartBadge = card.querySelector(".heart-badge");
  var emergencyTag = card.querySelector(".emergency-tag");
  var icon = btn.querySelector("i");
  if (btn.classList.contains("heart-static")) {
    btn.classList.remove("heart-static");
    heartBadge.classList.add("d-none");
    emergencyTag.classList.add("d-none");
    icon.className = "fa-regular fa-heart";
    // index in emergencyList
    var itemIndex = emergencyList.indexOf(contactList[emrgencyIdx]);
    emergencyList.splice(itemIndex, 1);
  } else {
    emergencyList.push(contactList[emrgencyIdx]);
    btn.classList.add("heart-static");
    heartBadge.classList.remove("d-none");
    emergencyTag.classList.remove("d-none");
    icon.className = "fa-solid fa-heart-pulse";
  }
  localStorage.setItem("emergencyContacts", JSON.stringify(emergencyList));
  firstLine.querySelector(".counterEmergency").innerHTML = emergencyList.length;
  displayEmergency();
}
// updateCounters
function updateCounters() {
  firstLine.querySelector(".counterTotal").innerHTML = contactList.length;
  firstLine.querySelector(".counterFav").innerHTML = favouriteList.length;
  firstLine.querySelector(".counterEmergency").innerHTML = emergencyList.length;
}
updateCounters();
// Fav side list
function displayFav() {
  var favLower = document.querySelector(".upper-card .lower");

  if (favouriteList.length === 0) {
    favLower.innerHTML = `<p>No favorites yet</p>`;
    favLower.classList.add("padding-1");
    return;
  }
  favLower.classList.remove("padding-1");
  var cartona = "";
  for (var i = 0; i < favouriteList.length; i++) {
    var firstChar = favouriteList[i].name.charAt(0).toUpperCase();
    cartona += `
<div class="side-contact-item side-contact-fav d-flex align-items-center justify-content-between p-2 my-2 border-bottom">
        <div class="d-flex align-items-center gap-2">
<div class="side-avatar text-white d-flex align-items-center justify-content-center"
style="background:${favouriteList[i].avatarColor || avatarColors[0]}">
            ${firstChar}
          </div>
          <div class="text-start">
<h5 class="mb-0 side-contact-name">${favouriteList[i].name}</h5>
        <small class="text-muted side-contact-phone">${favouriteList[i].phone}</small>
          </div>
        </div>
<a href="tel:${favouriteList[i].phone}" class="btn btn-sm btn-light side-call-btn d-flex align-items-center justify-content-center">
  <i class="fa-solid fa-phone"></i>
</a>
      </div>
    `;
  }
  favLower.innerHTML = cartona;
}

// emergency side List
function displayEmergency() {
  var emergencyLower = document.querySelector(".lower-card .lower");

  if (emergencyList.length === 0) {
    emergencyLower.classList.add("padding-1");
    emergencyLower.innerHTML = `<p>No emergency contacts</p>`;
    return;
  }
  emergencyLower.classList.remove("padding-1");
  var cartona = "";
  for (var i = 0; i < emergencyList.length; i++) {
    var firstChar = emergencyList[i].name.charAt(0).toUpperCase();
    cartona += `
<div class="side-contact-item side-contact-emergency d-flex align-items-center justify-content-between p-2 my-2 border-bottom">
        <div class="d-flex align-items-center gap-2">
<div class="side-avatar text-white d-flex align-items-center justify-content-center"
style="background:${emergencyList[i].avatarColor || avatarColors[0]}">
            ${firstChar}
          </div>
          <div class="text-start">
<h5 class="mb-0 side-contact-name">${emergencyList[i].name}</h5>
            <small class="text-muted side-contact-phone">${emergencyList[i].phone}</small>
          </div>
        </div>
<a href="tel:${emergencyList[i].phone}" class="btn btn-sm emergency-call-btn d-flex align-items-center justify-content-center">
  <i class="fa-solid fa-phone"></i>
</a>
      </div>
    `;
  }
  emergencyLower.innerHTML = cartona;
}
//delete Fav
function deleteFav(index) {
  favouriteList.splice(index, 1);

  localStorage.setItem("favouriteContacts", JSON.stringify(favouriteList));

  firstLine.querySelector(".counterFav").innerHTML = favouriteList.length;

  displayFav();
  display();
}

// delete Emergency
function deleteEmergency(index) {
  emergencyList.splice(index, 1);

  localStorage.setItem("emergencyContacts", JSON.stringify(emergencyList));

  firstLine.querySelector(".counterEmergency").innerHTML = emergencyList.length;

  displayEmergency();
  display();
}
// display everything
display();
displayFav();
displayEmergency();
