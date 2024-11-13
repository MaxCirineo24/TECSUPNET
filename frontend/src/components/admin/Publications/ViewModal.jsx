import { X } from 'lucide-react';

const ViewModal = ({ publication, closePublicationViewModal }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <button className="modal-close" onClick={closePublicationViewModal}>
        {<X size={20}/>}
        </button>
        <div className="container--field">
          <h2 className="container--fields-h2">Detalles de la Publicación</h2>
          <div className="information-fields">
            <span className="detail-span">Contenido:<p className="detail-p">{publication.content}</p></span>
            <span className="detail-span">Fecha de creación:<p className="detail-p">{publication.created_at}</p></span>
            <span className="detail-span">Author:<p className="detail-p">{publication.user.name} {publication.user.last_name}</p></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewModal