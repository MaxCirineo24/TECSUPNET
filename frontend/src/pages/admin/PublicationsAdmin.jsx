import { useState, useEffect, useCallback } from "react";
import { deletePublicationList, getPublicationsList } from "../../api/publication";
import HeaderAdmin from "../../components/HeaderAdmin";
import { Helmet } from "react-helmet";
import { Search } from "lucide-react";
import "../styles/crud-styles.css";

import DeleteModal from "../../components/admin/Publications/DeleteModal";
import ViewModal from "../../components/admin/Publications/ViewModal";

const PublicationsAdmin = () => {
  const [publications, setPublications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(6); // Ajusta según tu backend
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedPublication, setSelectedPublication] = useState(null);
  const [modalType, setModalType] = useState(null);

  const fetchPublications = useCallback(
    async (page = 1) => {
      try {
        const res = await getPublicationsList({
          page,
          page_size: recordsPerPage,
          search: searchQuery,
        });
        setPublications(res.results);
        setTotalPages(Math.ceil(res.count / recordsPerPage));
      } catch (error) {
        console.error("Error al obtener la lista de publicaciones:", error);
      }
    },
    [recordsPerPage, searchQuery]
  );
  
  const deletePublication = async (publicationId) => {
    try {
      await deletePublicationList(publicationId);
      setPublications((prevPublications) =>
        prevPublications.filter((publication) => publication.id !== publicationId)
      );
      closeModal();
    } catch (error) {
      console.error("Error al eliminar la publicación:", error);
    }
  };

  useEffect(() => {
    fetchPublications(currentPage);
  }, [currentPage, fetchPublications]);

  const onSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Resetea a la primera página al buscar
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openModal = (publication, type) => {
    setSelectedPublication(publication);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedPublication(null);
    setModalType(null);
  };

  return (
    <div>
      <Helmet>
        <title>TecsupNet | Admin Panel - Publications</title>
      </Helmet>
      <HeaderAdmin />

      <div className="container-crud">
        <h2 className="table-heading">Lista de Publicaciones</h2>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar publicaciones"
            value={searchQuery}
            onChange={onSearchInputChange}
          />
          <button className="search-btn" type="submit">
            <Search size={16} />
          </button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Contenido</th>
              <th>Author</th>
              <th>Fecha de Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {publications.length > 0 ? (
              publications.map((publication) => (
                <tr key={publication.id}>
                  <td>{publication.id}</td>
                  <td>{publication.content}</td>
                  <td>{publication.user.name} {publication.user.last_name}</td>
                  <td>{publication.created_at}</td>
                  <td>
                    <button
                      onClick={() => openModal(publication, "view")}
                      className="btn btn-primary"
                    >
                      Ver
                    </button>

                    <button
                      onClick={() => openModal(publication, "delete")}
                      className="btn btn-danger"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No hay publicaciones registradas.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="pagination-crud">
            <ul className="pagination-crud-ul">
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index + 1}>
                  <span
                    onClick={() => paginate(index + 1)}
                    className={`pagination-crud-span ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                  >
                    {index + 1}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {modalType === "view" && selectedPublication && (
        <ViewModal
          publication={selectedPublication}
          closePublicationViewModal={closeModal}
        />
      )}

      {modalType === "delete" && selectedPublication && (
        <DeleteModal
          publicationId={selectedPublication.id}
          deletePublication={deletePublication}
          closePublicationDeleteModal={closeModal}
        />
      )}
    </div>
  );
};

export default PublicationsAdmin;
