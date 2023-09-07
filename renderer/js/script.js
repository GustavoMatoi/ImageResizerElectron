const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');


const loadImage = (evt) => {
    const file = evt.target.files[0];
    if(!isFIleImage(file)){
        alertError("Selecione uma imagem.")
        return
    }

    //Dimensões originais

    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = function() {
        widthInput.value = this.width;
        heightInput.value = this.height;
    }

    form.style.display = "block";
    filename.innerText = file.name;
    outputPath.innerText = path.join(os.homedir(), 'imageResizer')
}

const alertError = (mensagem) => {
    Toastify.toast({
      text: mensagem,
      duration: 5000,
      close: false,
      style: {
        background: 'red',
        color: 'white',
        textAlign: 'center'
      }
    })
}
const alertSuccess = (mensagem) => {
    Toastify.toast({
      text: mensagem,
      duration: 5000,
      close: false,
      style: {
        background: 'green',
        color: 'white',
        textAlign: 'center'
      }
    })
}

ipcRenderer.on('image:done', () => {
    alertSuccess("Imagem enviada com sucesso")
})
//Tratamento de exceção - arquivo não é imagem
const isFIleImage = (arquivo) => {
    const acceptedImageTypes = ['image/gif', 'image/png', 'image/jpeg'];

    return arquivo && acceptedImageTypes.includes(arquivo['type'])
}


const sendImage = (evt) => {
    evt.preventDefault();

    const width = widthInput.value;
    const height = heightInput.value;
    const imgPath = img.files[0].path;

    if(!img.files[0]){
        alertError('Please upload an image')
        return
    }

    if(width == '' || height == ''){ 
        alertError('Informe uma altura e uma largura váldia')
        return;
    }
    
    ipcRenderer.send('image:resize', {
        imgPath,
        width,
        height
    })
}

img.addEventListener('change', loadImage)
form.addEventListener('submit', sendImage)