import { useEffect, useMemo, useState } from 'react';
import { Edit2, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
  type AdminCategoryResponse,
} from '../../api/adminCategoryApi';

export function CategorySettingsPage() {
  const [categories, setCategories] = useState<AdminCategoryResponse[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', parentId: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setCategories(await getAdminCategories());
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : '카테고리를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const categoryMap = useMemo(() => new Map(categories.map((item) => [item.categoryId, item])), [categories]);
  const filteredCategories = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return categories;
    return categories.filter((item) => [item.name, categoryMap.get(item.parentId ?? -1)?.name ?? '']
      .join(' ')
      .toLowerCase()
      .includes(keyword));
  }, [categories, categoryMap, query]);

  const resetForm = () => {
    setForm({ name: '', parentId: '' });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    const name = form.name.trim();
    if (!name) {
      alert('카테고리명을 입력해주세요.');
      return;
    }
    const parentId = form.parentId ? Number(form.parentId) : null;
    try {
      if (editingId) {
        const updated = await updateAdminCategory(editingId, { name, parentId });
        setCategories((prev) => prev.map((item) => item.categoryId === editingId ? updated : item));
        alert('카테고리를 수정했습니다.');
      } else {
        const created = await createAdminCategory({ name, parentId });
        setCategories((prev) => [...prev, created].sort((a, b) => a.categoryId - b.categoryId));
        alert('카테고리를 추가했습니다.');
      }
      resetForm();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : '저장에 실패했습니다.');
    }
  };

  const handleEdit = (category: AdminCategoryResponse) => {
    setEditingId(category.categoryId);
    setForm({ name: category.name, parentId: category.parentId ? String(category.parentId) : '' });
  };

  const handleDelete = async (category: AdminCategoryResponse) => {
    if (!confirm(`${category.name} 카테고리를 삭제할까요? 연결된 상품이 있으면 삭제가 실패할 수 있습니다.`)) return;
    try {
      await deleteAdminCategory(category.categoryId);
      setCategories((prev) => prev.filter((item) => item.categoryId !== category.categoryId));
      if (editingId === category.categoryId) resetForm();
      alert('카테고리를 삭제했습니다.');
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : '삭제에 실패했습니다. 연결된 상품이 있는지 확인해주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminSidebar />
      <main className="ml-64 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1.5">카테고리 설정</h1>
            <p className="text-gray-500">브랜드 스토어, 디자이너 스토어, 펀딩 상품 등록에 사용하는 카테고리를 관리합니다.</p>
          </div>
          <button onClick={load} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-white text-sm hover:bg-gray-50">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> 새로고침
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border shadow-sm p-5 h-fit">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">{editingId ? <Edit2 size={18} /> : <Plus size={18} />}{editingId ? '카테고리 수정' : '카테고리 추가'}</h2>
            <label className="block text-sm font-medium text-gray-700 mb-2">카테고리명</label>
            <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-3 border rounded-lg text-sm mb-4" placeholder="예: 아우터" />
            <label className="block text-sm font-medium text-gray-700 mb-2">상위 카테고리</label>
            <select value={form.parentId} onChange={(e) => setForm((prev) => ({ ...prev, parentId: e.target.value }))} className="w-full px-4 py-3 border rounded-lg text-sm bg-white mb-5">
              <option value="">상위 없음</option>
              {categories.filter((item) => item.categoryId !== editingId).map((item) => <option key={item.categoryId} value={item.categoryId}>{item.name}</option>)}
            </select>
            <div className="flex gap-2">
              <button onClick={handleSubmit} className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800">{editingId ? '수정 저장' : '추가'}</button>
              {editingId && <button onClick={resetForm} className="px-4 py-3 border rounded-lg text-sm">취소</button>}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm">
            <div className="p-5 border-b flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-xl">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 border rounded-lg text-sm" placeholder="카테고리명 검색" />
              </div>
              <span className="text-sm text-gray-500">총 {categories.length}개</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600"><tr><th className="px-5 py-3 text-left">ID</th><th className="px-5 py-3 text-left">카테고리명</th><th className="px-5 py-3 text-left">상위 카테고리</th><th className="px-5 py-3 text-right">관리</th></tr></thead>
                <tbody className="divide-y">
                  {filteredCategories.map((category) => (
                    <tr key={category.categoryId} className="hover:bg-gray-50">
                      <td className="px-5 py-4 text-gray-500">#{category.categoryId}</td>
                      <td className="px-5 py-4 font-bold text-gray-900">{category.name}</td>
                      <td className="px-5 py-4 text-gray-600">{category.parentId ? categoryMap.get(category.parentId)?.name ?? `ID ${category.parentId}` : '상위 없음'}</td>
                      <td className="px-5 py-4 text-right"><div className="flex justify-end gap-2"><button onClick={() => handleEdit(category)} className="inline-flex items-center gap-1 px-3 py-2 border rounded-lg text-xs"><Edit2 size={14} />수정</button><button onClick={() => handleDelete(category)} className="inline-flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg text-xs"><Trash2 size={14} />삭제</button></div></td>
                    </tr>
                  ))}
                  {filteredCategories.length === 0 && <tr><td colSpan={4} className="py-12 text-center text-gray-500">표시할 카테고리가 없습니다.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
