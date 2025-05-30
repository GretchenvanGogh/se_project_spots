import "./pages/index.css";
import { setButtonText } from "./utils/helpers.js";
import {
  settings,
  enableValidation,
  resetValidation,
  disableButton,
} from "./scripts/validation.js";
import Api from "../utils/Api.js";

const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restuarant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain House",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "e652845a-7220-4a96-9ecf-debf34d711a9",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardList.append(cardElement);
    });
    //Handle the user's information
    profileImage.src = userInfo.avatar;
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
  })
  .catch(console.error);

const allModals = document.querySelectorAll(".modal");

const profileEditButton = document.querySelector(".profile__edit-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileImage = document.querySelector(".profile__avatar");
const cardModalButton = document.querySelector(".profile__add-button");
const avatarModalButton = document.querySelector(".profile__avatar-btn");

const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseButton = editModal.querySelector(".modal__close-button");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);
const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitButton = cardModal.querySelector(".modal__submit-button");
const cardModalCloseButton = cardModal.querySelector(".modal__close-button");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitButton = avatarModal.querySelector(".modal__submit-button");
const avatarModalCloseButton = avatarModal.querySelector(
  ".modal__close-button"
);
const avatarLinkInput = avatarModal.querySelector("#profile-avatar-input");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteModalCancelButton = deleteModal.querySelector(
  ".modal__cancel-button"
);
const deleteModalCloseButton = deleteModal.querySelector(
  ".modal__close-button_type_delete"
);

const previewModal = document.querySelector("#preview-modal");
const previewModalImageElement = previewModal.querySelector(".modal__image");
const previewModalCaptionElement =
  previewModal.querySelector(".modal__caption");
const previewCloseButton = previewModal.querySelector(
  ".modal__close-button_type_preview"
);

const cardTemplate = document.querySelector("#card-template");
const cardList = document.querySelector(".cards__list");

let selectedCard, selectedCardId;

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleCardLike(evt, id) {
  let isLiked;
  if (evt.target.classList.contains("card__like-button_liked")) {
    isLiked = true;
  } else {
    isLiked = false;
  }

  api
    .changeLikeStatus(id, isLiked)
    .then((data) => {
      evt.target.classList.toggle("card__like-button_liked");
    })
    .catch(console.error);
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  if (data.isLiked) {
    cardLikeButton.classList.add("card__like-button_liked");
  }

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  cardLikeButton.addEventListener("click", (evt) =>
    handleCardLike(evt, data._id)
  );

  cardDeleteButton.addEventListener("click", () => {
    handleDeleteCard(cardElement, data._id);
  });

  cardImageElement.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageElement.src = data.link;
    previewModalImageElement.alt = data.name;
    previewModalCaptionElement.textContent = data.name;
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscapeKey);
  document.addEventListener("click", handleOverlayClick);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscapeKey);
  document.removeEventListener("click", handleOverlayClick);
}

function handleEditFormSubmit(event) {
  event.preventDefault();
  const submitButton = event.submitter;
  //submitButton.textContent = "Saving...";
  setButtonText(submitButton, true);

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch((error) => {
      console.error();
    })
    .finally(() => {
      setButtonText(submitButton, false);
    });
}

//TODO - implement loading text for all other form submission

function handleAddCardSubmit(event) {
  event.preventDefault();
  const submitButton = event.submitter;
  setButtonText(submitButton, true);
  api
    .postCards({
      name: cardNameInput.value,
      link: cardLinkInput.value,
    })
    .then((data) => {
      const cardEl = getCardElement(data);
      cardList.prepend(cardEl);
      event.target.reset();
      disableButton(cardSubmitButton, settings);
      closeModal(cardModal);
    })
    .catch((error) => {
      console.error();
    })
    .finally(() => {
      setButtonText(submitButton, false);
    });
}

function handleAvatarSubmit(event) {
  event.preventDefault();
  const submitButton = event.submitter;
  setButtonText(submitButton, true);
  api
    .editAvatarInfo(avatarLinkInput.value)
    .then((data) => {
      profileImage.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch((error) => {
      console.error();
    })
    .finally(() => {
      setButtonText(submitButton, false);
    });
}

function handleDeleteSubmit(event) {
  event.preventDefault();
  const submitButton = event.submitter;
  setButtonText(submitButton, true, "Deleting...");
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch((error) => {
      console.error();
    })
    .finally(() => {
      setButtonText(submitButton, false);
    });
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editModal);
});
editModalCloseButton.addEventListener("click", () => {
  closeModal(editModal);
});

cardModalButton.addEventListener("click", () => {
  openModal(cardModal);
});
cardModalCloseButton.addEventListener("click", () => {
  closeModal(cardModal);
});

avatarModalButton.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarModalCloseButton.addEventListener("click", () => {
  closeModal(avatarModal);
});

deleteModalCancelButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteModalCloseButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

previewCloseButton.addEventListener("click", () => {
  closeModal(previewModal);
});

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);
avatarForm.addEventListener("submit", handleAvatarSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);

function handleEscapeKey(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

function handleOverlayClick(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.target);
  }
}
enableValidation(settings);
