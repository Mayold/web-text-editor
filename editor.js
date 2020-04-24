class Editor {
    constructor(props) {
        this.container = props.container
       
        // creates editor field
        this.editor = document.createElement('div')
        this.editor.setAttribute('class', 'editor')
        this.editor.setAttribute('contenteditable', 'true')

        // creates toolbar
        this.toolbar = document.createElement('div')
        this.toolbar.setAttribute('class', 'toolbar')

        // creates placeholder
        this.placeholder = document.createElement('span')
        this.placeholder.setAttribute('class', 'placeholder')
        this.placeholder.textContent = props.placeholder
        this.editor.appendChild(this.placeholder)

        this.cursor = null

        // creates tag buttons in toolbar
        const tags = ['p', 'h1', 'h2', 'h3', 'h4']
        for(let tag of tags) {
            let button = document.createElement('div')
            button.setAttribute('class', 'btn')
            button.textContent = tag

            button.addEventListener('mousedown', (e) => {
                e.preventDefault()
                // creates tag as new element
                let newElement = document.createElement(tag)
                let cursorOffset = this.cursor.startOffset

                if(this.cursor.startContainer.nodeName == '#text') {                   
                    // ustala zawartość nowego elementu na taką jak w starym elemencie     
                    newElement.innerHTML = this.cursor.startContainer.parentNode.innerHTML
                    // replaces old with new
                    this.editor.replaceChild(
                        newElement,
                        this.cursor.startContainer.parentNode
                    );
                } else {
                    newElement.innerHTML = this.cursor.startContainer.innerHTML
                    this.editor.replaceChild(
                        newElement,
                        this.cursor.startContainer
                    )
                }

                let range = new Range()
                if (newElement.childNodes.length > 0)
                    range.setStart(newElement.childNodes[0], cursorOffset)
                else
                    range.setStart(newElement, 0);
                
                
                this.cursor = range
                window.getSelection().removeAllRanges()
                window.getSelection().addRange(this.cursor)
            })
            this.toolbar.appendChild(button)
        }

        this.container.appendChild(this.toolbar)
        this.container.appendChild(this.editor)

        this.editor.addEventListener('focus', (e) => {
            if(
                this.editor.children.length > 0 && 
                this.editor.firstChild === this.placeholder
            ) {
                e.preventDefault()
                // replaces placeholder with p
                this.editor.replaceChild(document.createElement('p'), this.placeholder)

                let range = new Range()
                range.setStart(this.editor.childNodes[0], 0)
                window.getSelection().removeAllRanges()
                window.getSelection().addRange(range)
            }
        })


        this.editor.addEventListener('blur', (e) => {
            if(
                this.editor.children.length === 1 &&
                this.editor.firstChild.textContent.length === 0
            )
                this.editor.replaceChild(this.placeholder, this.editor.firstChild)
        })


        this.editor.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'Backspace':
                    if(
                        this.editor.children.length === 1 && 
                        this.editor.firstChild.textContent.length === 0
                    ) {
                        e.preventDefault()
                    }
                default:
                    break;
            }
        })

        // enter
        this.editor.addEventListener('keyup', (e) => {
            switch(e.key) {
                case 'Enter':
                    let newElement = document.createElement('p')

                    for(let node of this.editor.childNodes) {
                        if(node.nodeName == 'DIV') {
                            newElement.textContent = node.textContent
                            this.editor.replaceChild(newElement, node)
                        }
                    }
                default:
                    break;
            }
            this.cursor = window.getSelection().getRangeAt(0)
        })

        this.editor.addEventListener('mouseup', (e) => {
            this.cursor = window.getSelection().getRangeAt(0);
        })
    }
}


// creates new editor
let editor = new Editor(
    {
        container: document.getElementById('app'),
        placeholder: 'Rozpocznij pisanie...' 
    }
)
