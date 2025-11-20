// src/components/Admin/Parcels/AdminParcels.jsx
import { useEffect, useState } from "react";
import "../../../styles/Admin/CRUD/genericStylesCrud.css";


const STATUS_OPTIONS = ["CREATED", "IN_TRANSIT", "DELIVERED", "FAILED"];

export default function AdminParcels() {

  const [parcels, setParcels] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [view, setView] = useState("list");
  const [selectedParcel, setSelectedParcel] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalpages] = useState(0);
  const [pageSize] = useState(10);

  const [formData, setFormData] = useState({
    code: "",
    senderName: "",
    senderPhone: "",
    receiverName: "",
    receiverPhone: "",
    price: "",
    status: "CREATED",
    proofPhotoUrl: "",
    deliveryOtp: ""
  });

  useEffect(() => {
    fetchParcels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Cargar página
  const fetchParcels = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `http://localhost:8080/api/v1/parcel/all?page=${currentPage}&size=${pageSize}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json"
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!res.ok) throw new Error("Error al cargar paquetes (parcels).");

      const data = await res.json();
      setParcels(data.content || []);
      setTotalpages(data.totalPages ?? 0);
    } catch (e) {
      console.error(e);
      setError(e.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  // Actualización de inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Campos numéricos controlados
    if (name === "price") {
      setFormData((p) => ({ ...p, [name]: value }));
      return;
    }
    if (name === "deliveryOtp") {
      setFormData((p) => ({ ...p, [name]: value }));
      return;
    }

    setFormData((p) => ({ ...p, [name]: value }));
  };

  // Crear
  const handleAdd = async () => {
    try {
      // Adaptar tipos: price -> number/string aceptable por BigDecimal, deliveryOtp -> int o null
      const payload = {
        ...formData,
        price:
          formData.price === "" || isNaN(Number(formData.price))
            ? 0
            : Number(formData.price),
        deliveryOtp:
          formData.deliveryOtp === "" ? null : Number(formData.deliveryOtp)
      };

      const res = await fetch("http://localhost:8080/api/v1/parcel/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        let msg = "Error al crear el paquete";
        try {
          const err = await res.json();
          msg = err.message || msg;
        } catch {}
        throw new Error(msg);
      }

      // Opcional: refrescar lista completa para mantener paginación consistente
      await fetchParcels();

      // Reset
      setFormData({
        code: "",
        senderName: "",
        senderPhone: "",
        receiverName: "",
        receiverPhone: "",
        price: "",
        status: "CREATED",
        proofPhotoUrl: "",
        deliveryOtp: ""
      });
      setView("list");
    } catch (e) {
      console.error(e);
      alert("Error: " + e.message);
    }
  };

  // Entrar a editar
  const handleEdit = (parcel) => {
    setSelectedParcel(parcel);
    setFormData({
      code: parcel.code ?? "",
      senderName: parcel.senderName ?? "",
      senderPhone: parcel.senderPhone ?? "",
      receiverName: parcel.receiverName ?? "",
      receiverPhone: parcel.receiverPhone ?? "",
      price:
        parcel.price !== null && parcel.price !== undefined
          ? String(parcel.price)
          : "",
      status: parcel.status ?? "CREATED",
      proofPhotoUrl: parcel.proofPhotoUrl ?? "",
      deliveryOtp:
        parcel.deliveryOtp !== null && parcel.deliveryOtp !== undefined
          ? String(parcel.deliveryOtp)
          : ""
    });
    setView("edit");
  };

  // Actualizar
  const handleUpdate = async () => {
    try {
      if (!selectedParcel) throw new Error("No hay elemento seleccionado.");

      const payload = {
        // DTO update permite parciales, pero aquí enviamos lo que haya en el form
        code: formData.code || null,
        senderName: formData.senderName || null,
        senderPhone: formData.senderPhone || null,
        receiverName: formData.receiverName || null,
        receiverPhone: formData.receiverPhone || null,
        price:
          formData.price === "" || isNaN(Number(formData.price))
            ? null
            : Number(formData.price),
        status: formData.status || null,
        proofPhotoUrl: formData.proofPhotoUrl || null,
        deliveryOtp:
          formData.deliveryOtp === "" ? null : Number(formData.deliveryOtp)
      };

      const res = await fetch(
        `http://localhost:8080/api/v1/parcel/update/${selectedParcel.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      if (!res.ok) {
        let msg = "Error al actualizar el paquete";
        try {
          const err = await res.json();
          msg = err.message || msg;
        } catch {}
        throw new Error(msg);
      }

      // Reset & refresh
      setSelectedParcel(null);
      setFormData({
        code: "",
        senderName: "",
        senderPhone: "",
        receiverName: "",
        receiverPhone: "",
        price: "",
        status: "CREATED",
        proofPhotoUrl: "",
        deliveryOtp: ""
      });
      await fetchParcels();
      setView("list");
    } catch (e) {
      console.error(e);
      alert("Error: " + e.message);
    }
  };

  // Ver detalle
  const handleDetail = (parcel) => {
    setSelectedParcel(parcel);
    setView("detail");
  };

  // Paginación simple
  const canPrev = currentPage > 0;
  const canNext = currentPage + 1 < totalPages;

  return (
    <div className="admin-buses">
      {/* Header */}
      <div className="admin-buses__header">
        <h2 className="admin-buses__title">Administrar Paquetes (Parcels)</h2>
        {view === "list" && (
          <button className="btn btn--primary" onClick={() => setView("add")}>
            + Agregar Parcel
          </button>
        )}
        {view !== "list" && (
          <button className="btn btn--secondary" onClick={() => setView("list")}>
            ← Volver
          </button>
        )}
      </div>

      {/* Mensajes */}
      {loading && <div className="info-banner">Cargando…</div>}
      {!!error && <div className="error-banner">{error}</div>}

      {/* Lista */}
      {view === "list" && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Sender</th>
                <th>Receiver</th>
                <th>Price</th>
                <th>Status</th>
                <th>OTP</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(parcels || []).map((p) => (
                <tr key={p.id}>
                  <td title={p.code}>{p.code}</td>
                  <td>
                    <div className="stack">
                      <span className="bold">{p.senderName}</span>
                      <span className="muted">{p.senderPhone}</span>
                    </div>
                  </td>
                  <td>
                    <div className="stack">
                      <span className="bold">{p.receiverName}</span>
                      <span className="muted">{p.receiverPhone}</span>
                    </div>
                  </td>
                  <td>
                    {Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      maximumFractionDigits: 0
                    }).format(Number(p.price || 0))}
                  </td>
                  <td>
                    <span className={`badge badge--${String(p.status || "").toLowerCase()}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>{p.deliveryOtp ?? "-"}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn--view" onClick={() => handleDetail(p)}>
                        Ver
                      </button>
                      <button className="btn btn--edit" onClick={() => handleEdit(p)}>
                        Editar
                      </button>
                      {/* Sin delete (según indicación) */}
                    </div>
                  </td>
                </tr>
              ))}
              {(!parcels || parcels.length === 0) && !loading && (
                <tr>
                  <td colSpan={7} className="muted">
                    Sin registros
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Controles de paginación */}
          <div className="pagination">
            <button
              className="btn btn--secondary"
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={!canPrev}
            >
              ← Anterior
            </button>
            <span className="muted">
              Página {currentPage + 1} de {Math.max(1, totalPages)}
            </span>
            <button
              className="btn btn--secondary"
              onClick={() => setCurrentPage((p) => (canNext ? p + 1 : p))}
              disabled={!canNext}
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}

      {/* Formulario Add / Edit */}
      {(view === "add" || view === "edit") && (
        <div className="form-container">
          <h3 className="form-title">
            {view === "add" ? "Agregar Parcel" : "Editar Parcel"}
          </h3>

          <div className="form two-col">
            <div className="form-group">
              <label>Code</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Price (COP)</label>
              <input
                type="number"
                min="0"
                step="1"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Sender Name</label>
              <input
                type="text"
                name="senderName"
                value={formData.senderName}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Sender Phone</label>
              <input
                type="tel"
                name="senderPhone"
                value={formData.senderPhone}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Receiver Name</label>
              <input
                type="text"
                name="receiverName"
                value={formData.receiverName}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Receiver Phone</label>
              <input
                type="tel"
                name="receiverPhone"
                value={formData.receiverPhone}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Proof Photo URL</label>
              <input
                type="url"
                name="proofPhotoUrl"
                value={formData.proofPhotoUrl}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Delivery OTP</label>
              <input
                type="number"
                name="deliveryOtp"
                value={formData.deliveryOtp}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-buttons">
            <button
              className="btn btn--primary"
              onClick={view === "add" ? handleAdd : handleUpdate}
            >
              {view === "add" ? "Guardar" : "Actualizar"}
            </button>
            <button className="btn btn--secondary" onClick={() => setView("list")}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Detalle */}
      {view === "detail" && selectedParcel && (
        <div className="detail-container">
          <h3 className="form-title">Detalle del Parcel</h3>
          <div className="detail-card">
            <div className="detail-item">
              <span className="detail-label">ID:</span>
              <span className="detail-value">{selectedParcel.id}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Code:</span>
              <span className="detail-value">{selectedParcel.code}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Sender:</span>
              <span className="detail-value">
                {selectedParcel.senderName} ({selectedParcel.senderPhone})
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Receiver:</span>
              <span className="detail-value">
                {selectedParcel.receiverName} ({selectedParcel.receiverPhone})
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Price:</span>
              <span className="detail-value">
                {Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                  maximumFractionDigits: 0
                }).format(Number(selectedParcel.price || 0))}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Status:</span>
              <span className="detail-value">{selectedParcel.status}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Delivery OTP:</span>
              <span className="detail-value">
                {selectedParcel.deliveryOtp ?? "-"}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Proof Photo:</span>
              <span className="detail-value">
                {selectedParcel.proofPhotoUrl ? (
                  <a
                    href={selectedParcel.proofPhotoUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ver imagen
                  </a>
                ) : (
                  "—"
                )}
              </span>
            </div>
          </div>

          <button className="btn btn--primary" onClick={() => setView("list")}>
            Volver a la lista
          </button>
        </div>
      )}
    </div>
  );
}
