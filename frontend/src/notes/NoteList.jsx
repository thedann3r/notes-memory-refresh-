import NoteItem from "./NoteItem"


function NoteList({notes,setNotes}){
    return(
       <div id="room-container">
          {notes.length >0? notes.map(note => (
            <NoteItem
            key={note.id}
            id={note.id}
            title ={note.title}
            content={note.content}
            created_at={note.created_at}
            updated_at={note.updated_at}
            notes={notes} 
            setNotes={setNotes}
            />
          )):null}
       </div>
    )
}

export default NoteList