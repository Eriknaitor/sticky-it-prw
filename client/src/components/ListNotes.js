import React from 'react';

const ListNotes = ({ notes, deleteNote }) => {

    return (
        <ul>
            {
                notes && notes.length > 0 ?
                    (notes.map(note => {
                        return (<li key={note._id} onClick={() => deleteNote(note._id)}>Borrar</li>)
                    })
                    ) : (<li>No hay notas :(</li>)
            }
        </ul>
    )
}

export default ListNotes