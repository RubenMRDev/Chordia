/************************
 * RESPONSIVE FUNCTIONS *
 ***********************/
function getKeyDimensions(numOctaves) {
  const isMobile = window.innerWidth < 640;
  if (isMobile) {
    const containerWidth = window.innerWidth - 32;
    const whiteKeyWidth = containerWidth / (7 * numOctaves);
    const whiteKeyHeight = whiteKeyWidth * 5;
    const blackKeyWidth = whiteKeyWidth * (24 / 40);
    const blackKeyHeight = whiteKeyHeight * (120 / 200);
    return { whiteKeyWidth, whiteKeyHeight, blackKeyWidth, blackKeyHeight };
  } else {
    return {
      whiteKeyWidth: 40,
      whiteKeyHeight: 200,
      blackKeyWidth: 24,
      blackKeyHeight: 120,
    };
  }
}

function getSavedKeyDimensions(numOctaves) {
  const interactive = getKeyDimensions(numOctaves);
  const scale = 0.5;
  return {
    whiteKeyWidth: interactive.whiteKeyWidth * scale,
    whiteKeyHeight: interactive.whiteKeyHeight * scale,
    blackKeyWidth: interactive.blackKeyWidth * scale,
    blackKeyHeight: interactive.blackKeyHeight * scale,
  };
}

/********************
 * GLOBAL VARIABLES *
 ********************/
const whiteNotes = ["C", "D", "E", "F", "G", "A", "B"];
const blackKeyPositions = [
  { note: "C#", whiteIndex: 0 },
  { note: "D#", whiteIndex: 1 },
  { note: "F#", whiteIndex: 3 },
  { note: "G#", whiteIndex: 4 },
  { note: "A#", whiteIndex: 5 },
];
let selectedKeys = [];
let interactiveKeyElements = {};
let savedChords = [];
let editingChordIndex = null;

/****************************
 * RENDER INTERACTIVE PIANO *
 ***************************/
function renderPiano(containerId, numOctaves) {
  const dims = getKeyDimensions(numOctaves);
  const pianoKeysContainer = document.getElementById(containerId);
  pianoKeysContainer.innerHTML = "";
  interactiveKeyElements = {};

  for (let oct = 1; oct <= numOctaves; oct++) {
    const octaveContainer = document.createElement("div");
    octaveContainer.classList.add("relative", "inline-block", "mr-1", "noselect");
    octaveContainer.style.width = whiteNotes.length * dims.whiteKeyWidth + "px";
    octaveContainer.style.height = dims.whiteKeyHeight + "px";
    octaveContainer.style.position = "relative";

    whiteNotes.forEach((note, index) => {
      const keyDiv = document.createElement("div");
      const keyLabel = note + oct;
      keyDiv.dataset.note = keyLabel;
      keyDiv.classList.add(
        "border",
        "border-gray-400",
        "bg-white",
        "cursor-pointer",
        "text-center",
        "absolute",
        "bottom-0"
      );
      keyDiv.style.width = dims.whiteKeyWidth + "px";
      keyDiv.style.height = dims.whiteKeyHeight + "px";
      keyDiv.style.left = index * dims.whiteKeyWidth + "px";
      keyDiv.style.zIndex = 1;
      keyDiv.style.lineHeight = dims.whiteKeyHeight + "px";
      keyDiv.style.userSelect = "none";
      keyDiv.addEventListener("click", () => toggleKeySelection(keyDiv, keyLabel));
      interactiveKeyElements[keyLabel] = keyDiv;
      octaveContainer.appendChild(keyDiv);
    });

    blackKeyPositions.forEach((bk) => {
      const keyDiv = document.createElement("div");
      const keyLabel = bk.note + oct;
      keyDiv.dataset.note = keyLabel;
      keyDiv.classList.add(
        "bg-black",
        "text-white",
        "cursor-pointer",
        "absolute",
        "noselect"
      );
      keyDiv.style.width = dims.blackKeyWidth + "px";
      keyDiv.style.height = dims.blackKeyHeight + "px";
      keyDiv.style.top = "0px";
      const leftPos =
        bk.whiteIndex * dims.whiteKeyWidth +
        (dims.whiteKeyWidth - dims.blackKeyWidth / 2);
      keyDiv.style.left = leftPos + "px";
      keyDiv.style.zIndex = 2;
      keyDiv.style.userSelect = "none";
      keyDiv.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleKeySelection(keyDiv, keyLabel);
      });
      interactiveKeyElements[keyLabel] = keyDiv;
      octaveContainer.appendChild(keyDiv);
    });

    pianoKeysContainer.appendChild(octaveContainer);
  }
  
  // Reaplicar selección
  selectedKeys.forEach((note) => {
    if (interactiveKeyElements[note]) {
      interactiveKeyElements[note].classList.add("ring", "ring-blue-500");
    }
  });
}

/*********************
 * SWEET ALERT PIANO *
 ********************/
function showPianoAlert() {
  const initialOctaves = 1;
  const pianoHTML = `
    <button 
      id="swal-closeBtn" 
      class="absolute top-2 right-2 text-2xl text-red-500 hover:text-red-700 bg-transparent border-none cursor-pointer"
    >
      &times;
    </button>
    <div class="mb-4">
      <label for="swal-numOctaves" class="mr-2 font-semibold">Número de octavas:</label>
      <input
        type="number"
        id="swal-numOctaves"
        min="1"
        max="4"
        value="${initialOctaves}"
        class="p-2 border rounded w-16"
      />
    </div>

    <div id="swal-pianoKeys" class="overflow-auto whitespace-nowrap border bg-gray-200 relative mb-4"></div>

    <div class="mb-2">
      <label for="swal-chordName" class="mr-2 font-semibold">Nombre del acorde:</label>
      <input
        type="text"
        id="swal-chordName"
        placeholder="Ingresa el nombre del acorde"
        class="p-2 border rounded w-full"
      />
    </div>

    <div class="flex flex-wrap gap-2">
      <button
        id="swal-saveChordBtn"
        class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
      >
        Guardar Acorde
      </button>
      <button
        id="swal-clearKeysBtn"
        class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
      >
        Eliminar Teclas
      </button>
    </div>
  `;

  Swal.fire({
    title: 'Crear nuevo acorde',
    html: pianoHTML,
    width: '90%',
    showConfirmButton: false,
    didOpen: () => {
      const swalNumOctaves = document.getElementById('swal-numOctaves');
      const swalSaveBtn = document.getElementById('swal-saveChordBtn');
      const swalClearBtn = document.getElementById('swal-clearKeysBtn');
      const swalCloseBtn = document.getElementById('swal-closeBtn');

      swalCloseBtn.addEventListener('click', () => {
        if (editingChordIndex !== null) {
          editingChordIndex = null;
          selectedKeys = [];
        }
        Swal.close();
      });

      renderPiano('swal-pianoKeys', initialOctaves);

      swalNumOctaves.addEventListener('change', () => {
        renderPiano('swal-pianoKeys', parseInt(swalNumOctaves.value));
      });

      swalClearBtn.addEventListener('click', () => {
        selectedKeys = [];
        Object.values(interactiveKeyElements).forEach((el) => {
          el.classList.remove("ring", "ring-blue-500");
        });
      });

      swalSaveBtn.addEventListener('click', () => {
        const chordName = document.getElementById('swal-chordName').value.trim();
        const numOctaves = parseInt(swalNumOctaves.value);

        if (selectedKeys.length === 0) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Por favor, selecciona al menos una tecla para formar un acorde."
          });
          return;
        }

        if (!chordName) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Por favor, ingresa un nombre para el acorde."
          });
          return;
        }

        if (editingChordIndex === null) {
          savedChords.push({
            name: chordName,
            keys: [...selectedKeys],
            numOctaves: numOctaves,
          });
        } else {
          savedChords[editingChordIndex] = {
            name: chordName,
            keys: [...selectedKeys],
            numOctaves: numOctaves,
          };
          editingChordIndex = null;
        }

        updateChordList();
        selectedKeys = [];
        Swal.close();
      });
    }
  });
}

/*****************
 * SELECT TOGGLE *
 *****************/
function toggleKeySelection(keyElement, note) {
  if (selectedKeys.includes(note)) {
    selectedKeys = selectedKeys.filter((n) => n !== note);
    keyElement.classList.remove("ring", "ring-blue-500");
  } else {
    selectedKeys.push(note);
    keyElement.classList.add("ring", "ring-blue-500");
  }
}

/**********************
 * RENDER SAVED CHORD *
 *********************/
function renderSavedChord(chordKeys, numOctaves) {
  const savedDims = getSavedKeyDimensions(numOctaves);
  const chordContainer = document.createElement("div");
  chordContainer.classList.add("border", "p-2", "bg-gray-100", "noselect");

  for (let oct = 1; oct <= numOctaves; oct++) {
    const octaveContainer = document.createElement("div");
    octaveContainer.classList.add("relative", "inline-block", "mr-1");
    octaveContainer.style.width = whiteNotes.length * savedDims.whiteKeyWidth + "px";
    octaveContainer.style.height = savedDims.whiteKeyHeight + "px";
    octaveContainer.style.position = "relative";

    whiteNotes.forEach((note, index) => {
      const keyDiv = document.createElement("div");
      const keyLabel = note + oct;
      keyDiv.dataset.note = keyLabel;
      keyDiv.classList.add("border", "border-gray-400", "bg-white", "absolute", "text-center");
      keyDiv.style.width = savedDims.whiteKeyWidth + "px";
      keyDiv.style.height = savedDims.whiteKeyHeight + "px";
      keyDiv.style.left = index * savedDims.whiteKeyWidth + "px";
      keyDiv.style.bottom = "0px";
      keyDiv.style.lineHeight = savedDims.whiteKeyHeight + "px";
      if (chordKeys.includes(keyLabel)) {
        keyDiv.classList.add("bg-yellow-300");
      }
      octaveContainer.appendChild(keyDiv);
    });

    blackKeyPositions.forEach((bk) => {
      const keyDiv = document.createElement("div");
      const keyLabel = bk.note + oct;
      keyDiv.dataset.note = keyLabel;
      keyDiv.classList.add("bg-black", "text-white", "absolute");
      keyDiv.style.width = savedDims.blackKeyWidth + "px";
      keyDiv.style.height = savedDims.blackKeyHeight + "px";
      keyDiv.style.top = "0px";
      const leftPos =
        bk.whiteIndex * savedDims.whiteKeyWidth +
        (savedDims.whiteKeyWidth - savedDims.blackKeyWidth / 2);
      keyDiv.style.left = leftPos + "px";
      keyDiv.style.zIndex = 2;
      if (chordKeys.includes(keyLabel)) {
        keyDiv.style.backgroundColor = "#facc15";
      }
      octaveContainer.appendChild(keyDiv);
    });

    chordContainer.appendChild(octaveContainer);
  }
  return chordContainer;
}

/*********************
 * UPDATE CHORD LIST *
 ********************/
function updateChordList() {
  const chordListEl = document.getElementById("chordList");
  chordListEl.innerHTML = "";
  savedChords.forEach((chord, index) => {
    const chordWrapper = document.createElement("div");
    chordWrapper.classList.add("p-2", "border", "bg-white", "noselect");
    
    const chordTitle = document.createElement("p");
    chordTitle.classList.add("font-bold", "mb-2");
    chordTitle.textContent = chord.name;
    chordWrapper.appendChild(chordTitle);

    const chordDiagram = renderSavedChord(chord.keys, chord.numOctaves);
    chordWrapper.appendChild(chordDiagram);

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("flex", "gap-2", "mt-2");

    const editBtn = document.createElement("button");
    editBtn.classList.add("bg-blue-500", "text-white", "py-1", "px-3", "rounded", "hover:bg-blue-600");
    editBtn.textContent = "Editar";
    editBtn.addEventListener("click", () => editChord(index));

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("bg-red-500", "text-white", "py-1", "px-3", "rounded", "hover:bg-red-600");
    deleteBtn.textContent = "Eliminar";
    deleteBtn.addEventListener("click", () => confirmDelete(index));

    const upBtn = document.createElement("button");
    upBtn.classList.add("bg-gray-500", "text-white", "py-1", "px-3", "rounded", "hover:bg-gray-600");
    upBtn.textContent = "Subir";
    upBtn.addEventListener("click", () => moveChordUp(index));

    const downBtn = document.createElement("button");
    downBtn.classList.add("bg-gray-500", "text-white", "py-1", "px-3", "rounded", "hover:bg-gray-600");
    downBtn.textContent = "Bajar";
    downBtn.addEventListener("click", () => moveChordDown(index));

    buttonContainer.append(editBtn, deleteBtn, upBtn, downBtn);
    chordWrapper.appendChild(buttonContainer);
    chordListEl.appendChild(chordWrapper);
  });
}

/**********************
 * MOVEMENT FUNCTIONS *
 **********************/
function moveChordUp(index) {
  if (index > 0) {
    [savedChords[index - 1], savedChords[index]] = [savedChords[index], savedChords[index - 1]];
    updateChordList();
  }
}

function moveChordDown(index) {
  if (index < savedChords.length - 1) {
    [savedChords[index + 1], savedChords[index]] = [savedChords[index], savedChords[index + 1]];
    updateChordList();
  }
}

/**************
 * EDIT CHORD *
 *************/
function editChord(index) {
  editingChordIndex = index;
  const chord = savedChords[index];
  selectedKeys = [...chord.keys];
  showPianoAlert();
  
  setTimeout(() => {
    document.getElementById('swal-chordName').value = chord.name;
    document.getElementById('swal-numOctaves').value = chord.numOctaves;
    renderPiano('swal-pianoKeys', chord.numOctaves);
  }, 100);
}

/******************
 * CONFIRM DELETE *
 *****************/
function confirmDelete(index) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "¡No podrás revertir esto!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar'
  }).then((result) => {
    if (result.isConfirmed) {
      savedChords.splice(index, 1);
      updateChordList();
    }
  });
}

/******************
 * IMPORT/EXPORT  *
 *****************/
function exportChords() {
  const dataStr = JSON.stringify(savedChords);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "partituras.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importChords(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedData = JSON.parse(e.target.result);
      if (Array.isArray(importedData)) {
        savedChords = importedData;
        updateChordList();
      } else {
        Swal.fire("Error", "Formato de archivo inválido", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Error al leer el archivo", "error");
    }
  };
  reader.readAsText(file);
}

/********************
 * EVENT LISTENERS *
 ********************/
document.getElementById("togglePianoBtn").addEventListener("click", showPianoAlert);
document.getElementById("exportBtn").addEventListener("click", exportChords);
document.getElementById("importBtn").addEventListener("click", () => document.getElementById("fileInput").click());
document.getElementById("fileInput").addEventListener("change", (e) => {
  if (e.target.files[0]) importChords(e.target.files[0]);
});

window.addEventListener("resize", () => {
  if (document.getElementById('swal-pianoKeys')) {
    const numOctaves = parseInt(document.getElementById('swal-numOctaves').value || 1);
    renderPiano('swal-pianoKeys', numOctaves);
  }
});

updateChordList();