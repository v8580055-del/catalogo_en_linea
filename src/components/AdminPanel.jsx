import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    Upload,
    Edit,
    Plus,
    Trash2,
    Save,
    Image as ImageIcon,
    Loader2,
    AlertCircle,
    CheckCircle2,
    X
} from 'lucide-react';
import { GOOGLE_DRIVE_CONFIG } from '../config';
import { fetchFolderFiles, uploadFileToDrive, updateFileMetadata, deleteFileFromDrive } from '../services/googleDrive';
import { parseDescription } from '../utils/helpers';

const AdminPanel = ({ user, onClose }) => {
    const [mode, setMode] = useState('list'); // 'list' or 'upload' or 'edit'
    const [selectedFolder, setSelectedFolder] = useState(GOOGLE_DRIVE_CONFIG.FOLDERS.find(f => !['all', 'latest'].includes(f.id)));
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }

    // Form states
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        variants: [{ name: '', price: '' }],
        file: null
    });

    const folders = GOOGLE_DRIVE_CONFIG.FOLDERS.filter(f => !['all', 'latest'].includes(f.id));

    useEffect(() => {
        if (mode === 'list' && selectedFolder) {
            loadFolderProducts();
        }
    }, [mode, selectedFolder]);

    const loadFolderProducts = async () => {
        setLoading(true);
        try {
            const result = await fetchFolderFiles(selectedFolder.id, null, 100);
            setProducts(result.files);
        } catch (err) {
            console.error(err);
            showMsg('error', 'Error al cargar productos');
        } finally {
            setLoading(false);
        }
    };

    const showMsg = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    };

    const handleAddVariant = () => {
        setFormData({ ...formData, variants: [...formData.variants, { name: '', price: '' }] });
    };

    const handleRemoveVariant = (index) => {
        const newVariants = formData.variants.filter((_, i) => i !== index);
        setFormData({ ...formData, variants: newVariants });
    };

    const updateVariant = (index, field, value) => {
        const newVariants = [...formData.variants];
        newVariants[index][field] = value;
        setFormData({ ...formData, variants: newVariants });
    };

    const buildFullDescription = () => {
        let desc = `# ${formData.title}\n\n${formData.description}\n\n`;
        formData.variants.forEach(v => {
            if (v.name && v.price) {
                desc += `> ${v.name} | ${v.price}\n`;
            }
        });
        return desc.trim();
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!formData.file || !formData.title) {
            showMsg('error', 'Por favor llena los campos obligatorios');
            return;
        }

        setActionLoading(true);
        try {
            const fullDesc = buildFullDescription();
            await uploadFileToDrive(user.access_token, selectedFolder.id, formData.file, {
                name: formData.title,
                description: fullDesc
            });
            showMsg('success', 'Producto subido correctamente');
            setMode('list');
            resetForm();
        } catch (err) {
            showMsg('error', 'Error al subir el producto');
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            const fullDesc = buildFullDescription();
            await updateFileMetadata(user.access_token, editingProduct.id, {
                name: formData.title,
                description: fullDesc
            });
            showMsg('success', 'Producto actualizado');
            setMode('list');
            resetForm();
        } catch (err) {
            showMsg('error', 'Error al actualizar');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

        setActionLoading(true);
        try {
            await deleteFileFromDrive(user.access_token, id);
            showMsg('success', 'Producto eliminado');
            loadFolderProducts();
        } catch (err) {
            showMsg('error', 'Error al eliminar');
        } finally {
            setActionLoading(false);
        }
    };

    const startEditing = (product) => {
        const parsed = parseDescription(product.description);
        setEditingProduct(product);
        setFormData({
            title: parsed.title || product.name,
            description: parsed.description || '',
            variants: parsed.variants.length > 0 ? parsed.variants : [{ name: '', price: '' }],
            file: null
        });
        setMode('edit');
    };

    const resetForm = () => {
        setFormData({ title: '', description: '', variants: [{ name: '', price: '' }], file: null });
        setEditingProduct(null);
    };

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[200] bg-[#f0f4f4] flex flex-col"
        >
            {/* Header */}
            <div className="px-6 pt-12 pb-6 flex items-center justify-between sm:px-12 bg-white/50 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-cat-brown shadow-sm active:scale-95 transition-transform"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <h2 className="text-xl font-black text-cat-brown uppercase tracking-tight">Admin Catálogo</h2>
                </div>

                {mode === 'list' && (
                    <button
                        onClick={() => { setMode('upload'); resetForm(); }}
                        className="bg-cat-teal-dark text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-all"
                    >
                        <Plus size={16} />
                        Nuevo Producto
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-12">
                <div className="max-w-4xl mx-auto pb-20">

                    {/* Message Notification */}
                    <AnimatePresence>
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={`mb-6 p-4 rounded-2xl flex items-center gap-3 shadow-lg ${message.type === 'success' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'
                                    } border`}
                            >
                                {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                                <span className="text-sm font-bold">{message.text}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Folder Selector */}
                    <div className="mb-8 overflow-x-auto no-scrollbar pb-2">
                        <div className="flex gap-3">
                            {folders.map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => setSelectedFolder(f)}
                                    className={`px-6 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${selectedFolder.id === f.id
                                        ? 'bg-cat-orange text-white border-cat-orange shadow-lg'
                                        : 'bg-white text-slate-500 border-slate-100 hover:border-cat-orange'
                                        }`}
                                >
                                    {f.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {mode === 'list' ? (
                        <div className="space-y-4">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
                                    <Loader2 className="animate-spin text-cat-teal-dark" size={40} />
                                    <p className="font-bold text-slate-500">Cargando productos...</p>
                                </div>
                            ) : products.length === 0 ? (
                                <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
                                    <ImageIcon className="mx-auto text-slate-200 mb-4" size={48} />
                                    <p className="font-bold text-slate-400 uppercase tracking-widest text-sm">No hay productos en esta carpeta</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {products.map(p => (
                                        <div key={p.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex gap-4 group">
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0">
                                                <img
                                                    src={p.thumbnail}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                    referrerPolicy="no-referrer"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-cat-brown truncate mb-1">{p.name}</h4>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => startEditing(p)}
                                                        className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-cat-teal-dark hover:bg-cat-teal-light/20 transition-colors"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(p.id)}
                                                        className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-red-500 hover:bg-red-50 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <motion.form
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onSubmit={mode === 'upload' ? handleUpload : handleUpdate}
                            className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-50 space-y-6"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xl font-black text-cat-brown uppercase tracking-tight">
                                    {mode === 'upload' ? 'Nuevo Producto' : 'Editar Producto'}
                                </h3>
                                <button type="button" onClick={() => setMode('list')} className="text-slate-400 hover:text-cat-brown">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Image Upload Area (Only for Upload Mode) */}
                            {mode === 'upload' && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Imagen del Producto</label>
                                    <div className="relative group">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            required
                                        />
                                        <div className={`h-40 rounded-[2rem] border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 ${formData.file ? 'border-cat-teal-dark bg-cat-teal-light/10' : 'border-slate-200 group-hover:border-cat-orange bg-slate-50'
                                            }`}>
                                            {formData.file ? (
                                                <>
                                                    <CheckCircle2 className="text-cat-teal-dark" size={32} />
                                                    <p className="text-sm font-bold text-cat-teal-dark">{formData.file.name}</p>
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="text-slate-300 group-hover:text-cat-orange" size={32} />
                                                    <p className="text-xs font-bold text-slate-400">Click o arrastra la imagen aquí</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Text Inputs */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Título</label>
                                    <input
                                        type="text"
                                        placeholder="Ej: Taza Personalizada Galaxia"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-[#f8fbfa] rounded-2xl p-4 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-cat-orange/20 font-bold"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Descripción</label>
                                    <textarea
                                        placeholder="Características del producto..."
                                        rows={4}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-[#f8fbfa] rounded-2xl p-4 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-cat-orange/20 font-medium text-sm leading-relaxed"
                                    />
                                </div>
                            </div>

                            {/* Variants Editor */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Variantes y Precios</label>
                                    <button
                                        type="button"
                                        onClick={handleAddVariant}
                                        className="text-cat-teal-dark flex items-center gap-1 text-[10px] font-black uppercase tracking-widest"
                                    >
                                        <Plus size={14} /> Añadir Precio
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {formData.variants.map((v, i) => (
                                        <div key={i} className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Nombre (ej: Normal)"
                                                value={v.name}
                                                onChange={(e) => updateVariant(i, 'name', e.target.value)}
                                                className="flex-1 bg-[#f8fbfa] rounded-xl p-3 border border-slate-100 text-sm font-bold"
                                                required
                                            />
                                            <input
                                                type="text"
                                                placeholder="Precio (ej: 150)"
                                                value={v.price}
                                                onChange={(e) => updateVariant(i, 'price', e.target.value)}
                                                className="w-24 bg-[#f8fbfa] rounded-xl p-3 border border-slate-100 text-sm font-black text-cat-teal-dark"
                                                required
                                            />
                                            {formData.variants.length > 1 && (
                                                <button type="button" onClick={() => handleRemoveVariant(i)} className="text-slate-300 hover:text-red-500 p-2">
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={actionLoading}
                                className="w-full bg-cat-teal-dark text-white p-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-cat-teal-dark/20 hover:bg-cat-teal-dark/95 active:scale-[0.98] transition-all uppercase tracking-widest disabled:opacity-50"
                            >
                                {actionLoading ? (
                                    <Loader2 className="animate-spin" size={24} />
                                ) : (
                                    <>
                                        <Save size={24} />
                                        {mode === 'upload' ? 'Subir a Drive' : 'Guardar Cambios'}
                                    </>
                                )}
                            </button>
                        </motion.form>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default AdminPanel;
