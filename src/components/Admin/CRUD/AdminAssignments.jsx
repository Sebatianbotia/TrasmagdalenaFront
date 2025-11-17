import { useEffect, useState } from 'react';
import '../../../styles/Admin/CRUD/genericStylesCrud.css';

export default function AdminAssignments() {
    const [assignments, setAssignments] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [view, setView] = useState('list');

    const [selectedAssignment, setSelectedAssignment] = useState(null);

    const[currentPage, setCurrentPage] = useState(0);
    const[totalPages, setTotalpages] = useState(0)
    const[pageSize] = useState(10);

    const [formData, setFormData] = useState({
        tripId: '',
        dispatcherId: '',
        driverId: '',
        checkList: false,
        assignedAt: ''
    });

    //UseEffect carga los datos al montar el componente (de una)
    useEffect(()=>{
        fetchAssignments();
    }, [currentPage]);// se va a ejecutar cuando cambie la pagina

    const fetchAssignments = async () => {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:8080/api/v1/assignment/all?page=${currentPage}&size=${pageSize}`,
            {
                method: 'GET',
                headers: {
                    'Content-type':'application/json'
                    //Cuando implementemos el JWT (API:JS)
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        if(!response.ok){
            throw new Error('Error al cargar las asignaciones');
        }

        const data = await response.json(); //convertimos el response a json

        setAssignments(data.content); 
        setTotalpages(data.totalPages);
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleAdd = async () => {
        try{
                    // Convertir datetime-local a OffsetDateTime con zona horaria
        const assignedAtWithZone = formData.assignedAt 
            ? new Date(formData.assignedAt).toISOString() 
            : null;

        const dataToSend = {
            ...formData,
            assignedAt: assignedAtWithZone  // quitarlo despeus
        };

        const response = await fetch('http://localhost:8080/api/v1/assignment/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend) // JSON.stringify(formData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Datos no válidos");
        }

        const data = await response.json();
        setAssignments([...assignments, data]);

        setFormData({
            tripId: '',
            dispatcherId: '',
            driverId: '',
            checkList: false,
            assignedAt: ''
        });
        
        setView('list');
        
    } catch (error) {
        console.error('Error al crear asignación:', error);
        alert('Error: ' + error.message);
    }

    };

    const handleEdit = (assignment) => {
        setSelectedAssignment(assignment);
        setFormData(assignment);
        setView('edit');
    };

    const handleUpdate = async () => {
        try{
            const response = await fetch(`http://localhost:8080/api/v1/assignment/update/${selectedAssignment.id}`,
                {
                    method:'PATCH',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body:JSON.stringify(formData)
                }
            )
            if(!response.ok){
                const errorData = await response.json
                throw new Error(errorData.message || "Error al actualizar")
            }
    
            setFormData({
                tripId: '',
                dispatcherId: '',
                driverId: '',
                checkList: false,
                assignedAt: ''
            });
            fetchAssignments();
            setView('list');
        }
        catch(error){
            console.error('Error:',error.message);
            alert("Error: " + error.message)
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar esta asignación?')) {
            try{
                const response = await fetch (`http://localhost:8080/api/v1/assignment/delete/${id}`,
                    {
                        method: 'DELETE',
                        headers:{
                            'Content-Type':'application/json'
                        }
                    }
                )
                if(!response.ok){
                    throw new Error("No se pudo eliminar hp")
                }
                fetchAssignments();
            }
            catch(error){
                console.error('Error: '+ error.message);
                alert('Error: '+ error.message);
            }
        }
    };

    const handleDetail = (assignment) => {
        setSelectedAssignment(assignment);
        setView('detail');
    };

    return (
    <>
            <div className="admin-buses">
                <div className="admin-buses__header">
                    <h2 className="admin-buses__title">Administrar Asignaciones</h2>
                    {view === 'list' && (
                        <button className="btn btn--primary" onClick={() => setView('add')}>
                            + Agregar Asignación
                        </button>
                    )}
                    {view !== 'list' && (
                        <button className="btn btn--secondary" onClick={() => setView('list')}>
                            ← Volver
                        </button>
                    )}
                </div>

                {view === 'list' && (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID asingacion</th>
                                    <th>ID Viaje</th>
                                    <th>Despachador</th>
                                    <th>Conductor</th>
                                    <th>Checklist</th>
                                    <th>Asignado el</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignments.map(assignment => (
                                    <tr key={assignment.id}>
                                        <td>{assignment.id}</td>
                                        <td>{assignment.trip.id}</td>
                                        <td>{assignment.dispatcher.name}</td>
                                        <td>{assignment.driver.name}</td>
                                        <td>{assignment.checkList ? 'Sí' : 'No'}</td>
                                        <td>{assignment.assignedAt}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="btn btn--view"
                                                    onClick={() => handleDetail(assignment)}
                                                >
                                                    Ver
                                                </button>
                                                <button
                                                    className="btn btn--edit"
                                                    onClick={() => handleEdit(assignment)}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="btn btn--delete"
                                                    onClick={() => handleDelete(assignment.id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {(view === 'add' || view === 'edit') && (
                    <div className="form-container">
                        <h3 className="form-title">
                            {view === 'add' ? 'Agregar Nueva Asignación' : 'Editar Asignación'}
                        </h3>
                        <div className="form">
                            <div className="form-group">
                                <label>ID del Viaje (tripId)</label>
                                <input
                                    type="number"
                                    name="tripId"
                                    value={formData.tripId}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>ID del Despachador (dispatcherId)</label>
                                <input
                                    type="number"
                                    name="dispatcherId"
                                    value={formData.dispatcherId}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>ID del Conductor (driverId)</label>
                                <input
                                    type="number"
                                    name="driverId"
                                    value={formData.driverId}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Checklist completado (checkList)</label>
                                <input
                                    type="checkbox"
                                    name="checkList"
                                    checked={formData.checkList}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Fecha de asignación (assignedAt)</label>
                                <input
                                    type="datetime-local"
                                    name="assignedAt"
                                    value={formData.assignedAt}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-buttons">
                                <button
                                    className="btn btn--primary"
                                    onClick={view === 'add' ? handleAdd : handleUpdate}
                                >
                                    {view === 'add' ? 'Guardar' : 'Actualizar'}
                                </button>
                                <button
                                    className="btn btn--secondary"
                                    onClick={() => setView('list')}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'detail' && selectedAssignment && (
                    <div className="detail-container">
                        <h3 className="form-title">Detalle de la Asignación</h3>
                        <div className="detail-card">
                            <div className="detail-item">
                                <span className="detail-label">ID Asignación:</span>
                                <span className="detail-value">{selectedAssignment.id}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">ID Viaje (trip):</span>
                                <span className="detail-value">{selectedAssignment.tripId}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">ID Conductor (driver):</span>
                                <span className="detail-value">{selectedAssignment.driverId}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">ID Despachador (dispatcher):</span>
                                <span className="detail-value">{selectedAssignment.dispatcherId}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Checklist:</span>
                                <span className="detail-value">
                                    {selectedAssignment.checkList ? 'Completado' : 'Pendiente'}
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Asignado el:</span>
                                <span className="detail-value">{selectedAssignment.assignedAt}</span>
                            </div>
                        </div>
                        <button className="btn btn--primary" onClick={() => setView('list')}>
                            Volver a la lista
                        </button>
                    </div>
                )}
            </div>
    </>
    );
}
