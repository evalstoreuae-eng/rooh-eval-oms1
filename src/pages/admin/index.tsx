import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Person = {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  commission?: number;
};

type Invoice = {
  id: string;
  manualNumber?: string;
  customer?: string;
  emirate?: string;
  region?: string;
  amount?: number;
  currency?: string;
  createdAt: string;
};

const UAE_CITIES = ['أبوظبي', 'دبي', 'الشارقة', 'العيـن', 'رأس الخيمة', 'عجمان', 'أم القيوين', 'الفجيرة'];

export default function AdminPage() {
  const [employees, setEmployees] = useState<Person[]>(() => {
    try {
      const raw = localStorage.getItem('rooh:employees');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [partners, setPartners] = useState<Person[]>(() => {
    try {
      const raw = localStorage.getItem('rooh:partners');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const raw = localStorage.getItem('rooh:invoices');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('rooh:employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('rooh:partners', JSON.stringify(partners));
  }, [partners]);

  useEffect(() => {
    localStorage.setItem('rooh:invoices', JSON.stringify(invoices));
  }, [invoices]);

  // Simple sync to Supabase if configured
  useEffect(() => {
    if (!supabase) return;
    const sync = async () => {
      try {
        // example: upsert invoices (table must exist in Supabase)
        await supabase.from('invoices').upsert(invoices.map(i => ({ ...i, created_at: i.createdAt })), { onConflict: 'id' });
        await supabase.from('employees').upsert(employees, { onConflict: 'id' });
        await supabase.from('partners').upsert(partners, { onConflict: 'id' });
      } catch (err) {
        console.warn('Supabase sync failed', err);
      }
    };
    sync();
  }, [employees, partners, invoices]);

  // Pre-fill owner & partners as requested if empty
  useEffect(() => {
    if (employees.length === 0 && partners.length === 0) {
      const defaultEmployees: Person[] = [
        {
          id: 'ahmad-samir',
          name: 'أحمد سمير',
          role: 'المالك والمدير العام',
          email: 'evalstore.uae@gmail.com, Asyam9141@gmail.com',
          phone: '+971588075688, +971588605178',
          commission: 0,
        },
        {
          id: 'essam-emad',
          name: 'عصام عماد',
          role: 'مدير المبيعات',
          email: 'essamseyam125@gmail.com',
          phone: '+971542368033',
          commission: 5,
        },
        {
          id: 'khaled-samir',
          name: 'خالد سمير',
          role: 'مدير خدمة العملاء والبيع',
          email: 'Khaledsyam428@gmail.com',
          phone: '+201012476452',
          commission: 5,
        },
      ];
      const defaultPartners: Person[] = [
        {
          id: 'enjy-habib',
          name: 'إنجي حبيب',
          role: 'الشريك والمدير التنفيذي',
          email: 'Enjyhabib49@gmail.com',
          phone: '+971588671828',
          commission: 30,
        },
      ];
      setEmployees(defaultEmployees);
      setPartners(defaultPartners);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addEmployee = () => {
    const newE: Person = {
      id: `e-${Date.now()}`,
      name: 'موظف جديد',
      role: 'موظف',
      email: '',
      phone: '',
      commission: 0,
    };
    setEmployees([...employees, newE]);
  };

  const removeEmployee = (id: string) => {
    setEmployees(employees.filter((e) => e.id !== id));
  };

  const addInvoice = () => {
    const newInv: Invoice = {
      id: `inv-${Date.now()}`,
      manualNumber: '',
      customer: '',
      emirate: 'أبوظبي',
      region: '',
      amount: 0,
      currency: 'د.إ',
      createdAt: new Date().toISOString(),
    };
    setInvoices([newInv, ...invoices]);
  };

  const updateInvoice = (id: string, patch: Partial<Invoice>) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, ...patch } : inv));
  };

  const removeInvoice = (id: string) => setInvoices(invoices.filter(i => i.id !== id));

  return (
    <div style={{ padding: 24, fontFamily: 'Cairo, Tajawal, sans-serif', direction: 'rtl' }}>
      <h1>لوحة الإدارة (تجريبية)</h1>

      <section style={{ marginTop: 16 }}>
        <h2>الموظفين والشركاء</h2>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <h3>الموظفين</h3>
            <button onClick={addEmployee}>إضافة موظف</button>
            <ul>
              {employees.map((e) => (
                <li key={e.id}>
                  <strong>{e.name}</strong> — {e.role} — {e.email} — {e.phone} — نسبة: {e.commission}%
                  <button onClick={() => removeEmployee(e.id)}>حذف</button>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ flex: 1 }}>
            <h3>الشركاء</h3>
            <button onClick={() => setPartners([...partners, { id: `p-${Date.now()}`, name: 'شريك جديد', role: 'شريك', email: '', phone: '', commission: 0 }])}>إضافة شريك</button>
            <ul>
              {partners.map((p) => (
                <li key={p.id}>
                  <strong>{p.name}</strong> — {p.role} — {p.email} — {p.phone} — نسبة: {p.commission}%
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>الفواتير والطلبات</h2>
        <button onClick={addInvoice}>إضافة فاتورة جديدة</button>
        <div>
          {invoices.map(inv => (
            <div key={inv.id} style={{ border: '1px solid #ccc', padding: 12, marginTop: 8 }}>
              <div>
                <label>رقم الفاتورة / الطلب (يدوي):</label>
                <input value={inv.manualNumber || ''} onChange={(e) => updateInvoice(inv.id, { manualNumber: e.target.value })} />
              </div>
              <div>
                <label>العميل:</label>
                <input value={inv.customer || ''} onChange={(e) => updateInvoice(inv.id, { customer: e.target.value })} />
              </div>
              <div>
                <label>الإمارة:</label>
                <select value={inv.emirate} onChange={(e) => updateInvoice(inv.id, { emirate: e.target.value })}>
                  {UAE_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label>المنطقة:</label>
                <input value={inv.region || ''} onChange={(e) => updateInvoice(inv.id, { region: e.target.value })} />
              </div>
              <div>
                <label>المبلغ ({inv.currency}):</label>
                <input type="number" value={inv.amount} onChange={(e) => updateInvoice(inv.id, { amount: Number(e.target.value) })} />
              </div>
              <div style={{ marginTop: 8 }}>
                <button onClick={() => removeInvoice(inv.id)}>حذف</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>مزامنة السحابة (Supabase)</h2>
        <p>المزامنة التلقائية إلى Supabase مفعلّة إذا تم ضبط المتغيرات البيئية.</p>
      </section>

    </div>
  );
}
