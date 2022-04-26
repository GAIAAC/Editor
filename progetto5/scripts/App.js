import { FileDoc } from "./FileDoc.js";
import { UserInterface } from "./UserInterface.js";
/*importa le due classi definite negli altri files*/
export class App{
    ui = new UserInterface();
    files = [];
    openFile = null;
    idFile = -1;

    /* costruttore: i dati sono presi dal file editor.js che contengono gli id dell'html, che istanzia una nuova app e tramite il costruttore assegna i valori all'istanza di UserInterface  */
    constructor(_ui){ 
        this.ui = _ui;

    /*inizializza tinymce, passando il riferimento all html tramite la proprietà dell'oggetto*/
    tinymce.init({
        selector: `#${this.ui.editor}`
        });
    // quando nei metodi dovrò usare tinymce.get(this.ui.editor) avrò due metodi .setContent() e .getContent()
    /*assegnare le proprietà dell'oggetto riferendosi al DOM e passando la proprietà dell'oggetto UserInterface come sopra*/
    this.editor = document.querySelector(`#${this.ui.editor}`);
    this.title = document.querySelector(`#${this.ui.title}`);
    this.save = document.querySelector(`#${this.ui.save}`);
    this.new = document.querySelector(`#${this.ui.new}`);
    this.file_list = document.querySelector(`#${this.ui.file}`);
    this.eventHandlers();
    this.LoadDocs();
}
    /* chiamare il metodo che fa il bind dell'evento click */
    eventHandlers() {
        this.save.addEventListener("click", this.saveDoc.bind(this));
        this.new.addEventListener("click", this.newDoc.bind(this));
    }
    /* chiamare il metodo che recupera i dati dal localStorage*/
    LoadDocs() {
        if(localStorage.getItem("files")){
            this.files = JSON.parse(localStorage.getItem("files"));
            this.build();
    }
}
    /* metodo che fa il bind sul click, attenzione all'uso di this*/
     /* metodo che recupera i dati nel localStorage*/
     /* metodo che carica l'oggetto file */
    LoadFile(el){
        this.idFile = el.target.dataset.id;
        this.openFile = new FileDoc(this.files[this.idFile].title, this.files[this.idFile].text);
        this.title.value =this.openFile.title;
        tinymce.get(this.ui.editor).setContent(this.openFile.text);
    }
    /* metodo che ripulisce */
    newDoc() {
        this.clean();
    }
    /* altro metodo: se non ci sono file caricati crea un oggetto file e fa il push nell'array */
    /* altrimenti modifica il file assegnando i valori letti dal form*/
    saveDoc() {
        if(this.openFile == null){
            let file = new FileDoc();
            file.title = this.title.value;
            file.text = tinymce.get(this.ui.editor).getContent();
            this.files.push(file);
        }else{
            this.openFile.title = this.title.value;
            this.openFile.text = tinymce.get(this.ui.editor).getContent();
            this.files[this.idFile] = this.openFile;
        }
        localStorage.setItem("files", JSON.stringify(this.files));
        this.build();
    }
    /* salva l'array nel localStorage e chiama la funzione che stampa a video*/
    /* metodo che stampa a video */
    build(){
        this.clean();
        this.file_list.innerHTML = "";
        this.files.forEach((el, index) => {
            this.file_list.innerHTML += (`<li data-id="${index}" class="list-group-item list-group-item-action docs">${el.title}</li>`)
        });
        $(".docs").click(this.LoadFile.bind(this));
    }
    /* metodo che svuota il form */
    clean(){
        this.title.value = "";
        tinymce.get(this.ui.editor).setContent('');
        this.openFile = null;
    }
}