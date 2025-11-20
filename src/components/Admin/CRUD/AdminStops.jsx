import { useEffect, useState } from 'react';
import '../../../styles/Admin/CRUD/genericStylesCrud.css';

export default function AdminStops() {
    const [stops, setStops] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [view, setView] = useState('list');
    const [selectedStop, setSelectedStop] = useState(null);
    
    const[currentPage, setCurrentPage] = useState(0);
    const[totalPages, setTotalpages] = useState(0)
    const[pageSize] = useState(20);
    const [formData, setFormData] = useState({
        name: '',
        cityId: '',
        lat: '',
        lng: ''
    });

        useEffect(()=>{
                fetchStops();
            }, [currentPage]);
    const fetchStops = async () => {
        setLoading(true);
        setError(null);
    
        const response = await fetch(`http://localhost:8080/api/v1/stop/all?page=${currentPage}&size=${pageSize}`,
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
        
            setStops(data.content); 
            setTotalpages(data.totalPages);
    }


    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
        const handleAdd = async () => {
            try{
            const response = await fetch('http://localhost:8080/api/v1/stop/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData) // JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Datos no válidos");
            }

             const data = await response.json();
             setStops([...stops, data]);

            setFormData({ name: '', cityId: '', lat: '', lng: '' });

        
            setView('list');
        
            } catch (error) {
                console.error('Error al crear la ciudad:', error);
                alert('Error: ' + error.message);
            }

     };



    const handleEdit = (stop) => {
        setSelectedStop(stop);
        setFormData({
            name: stop.name,
            cityId: stop.cityId ?? '',
            lat: stop.lat,
            lng: stop.lng
        });
        setView('edit');
    };
    const handleUpdate = async () => {
        try{
            const response = await fetch(`http://localhost:8080/api/v1/stop/update/${selectedStop.id}`,
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
            console.log (formData)
    
            setFormData({ name: '', cityId: '', lat: '', lng: '' });


            fetchStops();
            setView('list');
        }
        catch(error){
            console.error('Error:',error.message);
            alert("Error: " + error.message)
        }
    };


      const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar esta parada?')) {
            try{
                const response = await fetch (`http://localhost:8080/api/v1/stop/delete/${id}`,
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

    const handleDetail = (stop) => {
        setSelectedStop(stop);
        setView('detail');
    };

    return (
        <div className="admin-buses">
            <div className="admin-buses__header">
                <h2 className="admin-buses__title">Administrar Paradas</h2>
                {view === 'list' && (
                    <button className="btn btn--primary" onClick={() => setView('add')}>
                        + Agregar Parada
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
                                <th>Nombre</th>
                                <th>Ciudad</th>
                                <th>Latitud</th>
                                <th>Longitud</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stops.map(stop => (
                                <tr key={stop.id}>
                                    <td>{stop.name}</td>
                                    <td>{stop.city?.name}</td>
                                    <td>{stop.lat}</td>
                                    <td>{stop.lng}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn btn--view"
                                                onClick={() => handleDetail(stop)}
                                            >
                                                Ver
                                            </button>
                                            <button
                                                className="btn btn--edit"
                                                onClick={() => handleEdit(stop)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn--delete"
                                                onClick={() => handleDelete(stop.id)}
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
                        {view === 'add' ? 'Agregar Nueva Parada' : 'Editar Parada'}
                    </h3>
                    <div className="form">
                        <div className="form-group">
                            <label>Nombre</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>ID Ciudad (cityId)</label>
                            <input
                                type="number"
                                name="cityId"
                                value={formData.cityId}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Latitud (lat)</label>
                            <input
                                type="number"
                                step="0.0001"
                                name="lat"
                                value={formData.lat}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Longitud (lng)</label>
                            <input
                                type="number"
                                step="0.0001"
                                name="lng"
                                value={formData.lng}
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

            {view === 'detail' && selectedStop && (
                <div className="detail-container">
                    <h3 className="form-title">Detalle de la Parada</h3>
                    <div className="detail-card">
                        <div className="detail-item">
                            <span className="detail-label">ID:</span>
                            <span className="detail-value">{selectedStop.id}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Nombre:</span>
                            <span className="detail-value">{selectedStop.name}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Ciudad:</span>
                            <span className="detail-value">
                                {selectedStop.city?.name}
                            </span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Latitud:</span>
                            <span className="detail-value">{selectedStop.lat}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Longitud:</span>
                            <span className="detail-value">{selectedStop.lng}</span>
                        </div>
                    </div>
                    <button className="btn btn--primary" onClick={() => setView('list')}>
                        Volver a la lista
                    </button>
                </div>
            )}
        </div>
    );
}
