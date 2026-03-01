import React, { useState, useMemo } from 'react';
import CryptoJS from 'crypto-js';
import {
    Home, Landmark, PiggyBank, Briefcase,
    Receipt, Plane, RefreshCw, AlertCircle,
    Sparkles, X, Loader2, Trash2, Plus, GripVertical, Zap, User,
    Minus
} from 'lucide-react';
import '../styles/sankey.css';

// --- Gemini API Configuration ---
const apiKey = ""; // Keep empty for demo or inject securely

const callGeminiAPI = async (prompt, systemInstruction) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] }
    };

    const delays = [1000, 2000, 4000, 8000, 16000];

    for (let attempt = 0; attempt <= 5; attempt++) {
        try {
            if (!apiKey) return "API Key not configured in demo mode.";
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || "No insights generated.";
        } catch (error) {
            console.error(error);
            if (attempt === 5) {
                console.error("Gemini API failed after 5 retries.");
                return "I'm sorry, I couldn't generate insights at this moment. Please try again later.";
            }
            await new Promise(resolve => setTimeout(resolve, delays[attempt]));
        }
    }
};

// --- Utility Functions ---
const calculateUKIncomeTax = (gross) => {
    let tax = 0;
    let personalAllowance = 12570;
    if (gross > 100000) {
        const reduction = Math.floor((gross - 100000) / 2);
        personalAllowance = Math.max(0, personalAllowance - reduction);
    }
    const basicBandEnd = personalAllowance + 37700;
    const higherRateLimit = 125140;

    if (gross > personalAllowance) {
        const basicTaxable = Math.min(gross, basicBandEnd) - personalAllowance;
        tax += basicTaxable * 0.20;
    }
    if (gross > basicBandEnd) {
        const higherTaxable = Math.min(gross, higherRateLimit) - basicBandEnd;
        tax += higherTaxable * 0.40;
    }
    if (gross > higherRateLimit) {
        const additionalTaxable = gross - higherRateLimit;
        tax += additionalTaxable * 0.45;
    }
    return Math.round(tax);
};

const calculateUKNationalInsurance = (gross) => {
    let ni = 0;
    const primaryThreshold = 12570;
    const upperEarningsLimit = 50270;
    if (gross > primaryThreshold) {
        const mainBandEarnings = Math.min(gross, upperEarningsLimit) - primaryThreshold;
        ni += mainBandEarnings * 0.08;
    }
    if (gross > upperEarningsLimit) {
        const upperBandEarnings = gross - upperEarningsLimit;
        ni += upperBandEarnings * 0.02;
    }
    return Math.round(ni);
};

const calculateUKStudentLoan = (gross, isActive = true) => {
    if (!isActive) return 0;
    const threshold = 27295; // Plan 2 Threshold
    if (gross > threshold) {
        return Math.round((gross - threshold) * 0.09);
    }
    return 0;
};

// --- Initial Data ---
const COLORS_MAP = {
    primary: '#00C4CC',
    dark: '#1E1E21',
    yellow: '#FFE500',
    text: '#A0A0A5',
    white: '#FFFFFF',
    red: '#FF453A',
    blue: '#4DD0E1',
    rose: '#F43F5E',
    orange: '#FF9F0A',
    amber: '#FFD60A',
    violet: '#BF5AF2',
    teal: '#30D158',
    indigo: '#5E5CE6',
    sky: '#64D2FF'
};

const demoData = {
    grossIncome: 45000,
    bonus: 0,
    studentLoanActive: false,
    parentalLoan: 0,
    serviceCharge: 2000,
    bills: 3000,
    lifestyleCategories: [
        { id: 'cat_lifestyle', label: 'Lifestyle', value: 8000, color: 'var(--yellow-primary)', parentId: null },
        { id: 'cat_travel', label: 'Travel', value: 3000, color: 'var(--cyan-light)', parentId: null }
    ],
    nestPension: 2000,
    isa: 10000,
};

// Placeholder for real data encrypted. Default is encrypted via 'test' password
const encryptedBlob = "U2FsdGVkX1/MBQLtGgWY+RUk9kTEZSy7rwD9Th063G9AeDDYGLJ3xYuph/CD1LS73/Zfa6/+JgyiFTF47Y9n6uxc42QqjQ714AMEJztTSmDfNwh8YjbalvzyrwKO2kL68+2OD4XrkgBNUzbmmAMWmrIoK/9Rir4lWuZ8aBc3WnTZD1qyGciTIXAgpVcOhiHAsAljcHUOY1TG4j23+X0zdxH807yvUN6kvP0LgGb6f76kijq/tMkvEtD/Hrr4HKx/YttMWH+WWEg7aloUBkpMowe9NvrA8i44folErvgTKjaX0jJZ6EIRQAm93/ms+lLM1YPpLIVJS9c87JUiTv2lIvq6aJ58jzx3ogDpnM5eGpfNkjwlPGo0UvhGKMWXzUkwpur6ellvkq5rgesDux11qqvlXMMyELPfUnbxWOFUPuyyCA9esVdZ8ZDtGz67jRzGeZxsxmw5si8rEWHEBO4Po8nC5rfkvLYV/efnqTKHTMWbw+1aD8EjYoC3CogpUgdfpfk1EFzjrs/O4RbEUWqJJXgdL/7mqYTS2NSOS6aEeBpasWePsUaxvV3GDTAEgADRi0wjafHgvDr/Wx4l3eSzUwAWkfLYPAJt05VJY60eY9tJrsjcJ8dwk3Ov7J/MqufMqsqDF/ibWDokxQCEJBSQy9UjqZyQCyM02wtQi2Yk7FjydXRbihVnp1qvjTfoYqg7VX+1m+Dt/Q6G82VZGbfJuS5vzOz8aJjp1xOWOG22idgnc+GjmFZgDqqBXlgNiKuxTdr3uL0wtB/2cDNkkxpF10kUY9NmdWcBLsTbH53WJ04jg3O8ULOUJYI/0Y6fl0bLg6KfHjKP+Kw8sVZyG6jb69XRqxdvIrGY1M85GFdsbBvNzqzuEAvhhrTsiGYRITrC/IN2vM6nxTCt7bgYJSUekdaHI16R/EmCBju6QisYqdsfDqljnvlbPxSloTUIRGbKHK+BvWa4fgQJIxFp6DjsuPIVM2iPX25VIU1SeqCAxK/Xi+PQD1lmRUpUxyZYS361lIT56tyH+QtdJ1nfVgM8ZCc8u4txKBySMUEKV/UXOhkdr8aOe/U3Ry5a3nN1icNN";

const formatGBP = (value) =>
    new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(value);

const drawBezier = (x0, y0, x1, y1, width) => {
    const controlOffset = (x1 - x0) * 0.45;
    return `M ${x0} ${y0 + width / 2} C ${x0 + controlOffset} ${y0 + width / 2}, ${x1 - controlOffset} ${y1 + width / 2}, ${x1} ${y1 + width / 2}`;
};

// --- Components ---
const CalculatedField = ({ label, value, icon, colorVar, isMonthly }) => {
    const Icon = icon;
    const displayValue = isMonthly ? Math.round(value / 12) : value;
    return (
        <div className="sankey-field">
            <div className="sankey-field-header">
                <label className="sankey-field-label">
                    <Icon size={14} style={{ color: colorVar }} /> {label}
                    <span className="sankey-badge-auto">Auto</span>
                </label>
                <div className="sankey-calc-input">
                    <span className="currency-symbol">£</span>
                    <input type="number" readOnly value={displayValue || 0} className="hide-arrows" />
                </div>
            </div>
        </div>
    );
};

const ToggleField = ({ label, value, isActive, onToggle, icon, colorVar, isMonthly, hint }) => {
    const Icon = icon;
    const displayValue = isMonthly ? Math.round(value / 12) : value;
    return (
        <div className="sankey-field">
            <div className="sankey-field-header">
                <label className="sankey-field-label">
                    <Icon size={14} style={{ color: colorVar }} /> {label}
                    <span className="sankey-badge-auto">Auto</span>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <label className="sankey-switch">
                        <input type="checkbox" checked={isActive} onChange={onToggle} />
                        <span className="sankey-slider"></span>
                    </label>
                    <div className="sankey-calc-input" style={{ opacity: isActive ? 1 : 0.4 }}>
                        <span className="currency-symbol">£</span>
                        <input type="number" readOnly value={isActive ? displayValue : 0} className="hide-arrows" />
                    </div>
                </div>
            </div>
            {hint && <p className="sankey-field-hint">{hint}</p>}
        </div>
    );
};

const InputField = ({ label, field, icon, colorVar, data, isMonthly, updateField, hint }) => {
    const Icon = icon;
    const displayValue = isMonthly ? Math.round(data[field] / 12) : data[field];
    const smallStep = isMonthly ? 10 : 100;
    const largeStep = isMonthly ? 50 : 500;

    const handleInputChange = (e) => {
        let val = parseInt(e.target.value, 10);
        if (isNaN(val)) val = 0;
        updateField(field, isMonthly ? val * 12 : val);
    };

    const adjustValue = (amount) => {
        const current = displayValue || 0;
        const newVal = Math.max(0, current + amount);
        updateField(field, isMonthly ? newVal * 12 : newVal);
    };

    return (
        <div className="sankey-field">
            <div className="sankey-field-header">
                <label className="sankey-field-label">
                    <Icon size={14} style={{ color: colorVar }} /> {label}
                </label>
                <div className="sankey-input-group">
                    <button onClick={() => adjustValue(-largeStep)} className="sankey-stepper-btn" title="Decrease largely"><Minus size={16} strokeWidth={3} /></button>
                    <button onClick={() => adjustValue(-smallStep)} className="sankey-stepper-btn" title="Decrease"><Minus size={14} strokeWidth={1.5} /></button>

                    <div className="sankey-stepper-input">
                        <span className="currency-symbol">£</span>
                        <input
                            type="number"
                            value={displayValue || ''}
                            onChange={handleInputChange}
                            className="hide-arrows"
                        />
                    </div>

                    <button onClick={() => adjustValue(smallStep)} className="sankey-stepper-btn" title="Increase"><Plus size={14} strokeWidth={1.5} /></button>
                    <button onClick={() => adjustValue(largeStep)} className="sankey-stepper-btn" title="Increase largely"><Plus size={16} strokeWidth={3} /></button>
                </div>
            </div>
            {hint && <p className="sankey-field-hint">{hint}</p>}
        </div>
    );
};

const CategoryField = ({ label, value, icon, colorHex, isMonthly, onChange, onRemove, onGripEnter, onGripLeave }) => {
    const Icon = icon;
    const displayValue = isMonthly ? Math.round(value / 12) : value;
    const smallStep = isMonthly ? 10 : 100;
    const largeStep = isMonthly ? 50 : 500;

    const handleInputChange = (e) => {
        let val = parseInt(e.target.value, 10);
        if (isNaN(val)) val = 0;
        onChange(isMonthly ? val * 12 : val);
    };

    const adjustValue = (amount) => {
        const current = displayValue || 0;
        const newVal = Math.max(0, current + amount);
        onChange(isMonthly ? newVal * 12 : newVal);
    };

    return (
        <div className="sankey-field" style={{ marginBottom: '12px' }}>
            <div className="sankey-field-header" style={{ marginBottom: 0 }}>
                <label className="sankey-field-label" style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', paddingRight: '8px' }}>
                    <div
                        onMouseEnter={onGripEnter}
                        onMouseLeave={onGripLeave}
                        className="sankey-category-grip"
                    >
                        <GripVertical size={14} />
                    </div>
                    <Icon size={14} style={{ color: colorHex, flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    {onRemove && (
                        <button onClick={onRemove} className="sankey-remove-btn" title="Remove category">
                            <Trash2 size={14} />
                        </button>
                    )}
                    <div className="sankey-input-group">
                        <button onClick={() => adjustValue(-largeStep)} className="sankey-stepper-btn" title="Decrease largely"><Minus size={16} strokeWidth={3} /></button>
                        <button onClick={() => adjustValue(-smallStep)} className="sankey-stepper-btn" title="Decrease"><Minus size={14} strokeWidth={1.5} /></button>

                        <div className="sankey-stepper-input">
                            <span className="currency-symbol">£</span>
                            <input
                                type="number"
                                value={displayValue || ''}
                                onChange={handleInputChange}
                                className="hide-arrows"
                            />
                        </div>

                        <button onClick={() => adjustValue(smallStep)} className="sankey-stepper-btn" title="Increase"><Plus size={14} strokeWidth={1.5} /></button>
                        <button onClick={() => adjustValue(largeStep)} className="sankey-stepper-btn" title="Increase largely"><Plus size={16} strokeWidth={3} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function SankeyApp() {
    const [data, setData] = useState(demoData);
    const [isPrivate, setIsPrivate] = useState(false);
    const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, content: null });
    const [isMonthly, setIsMonthly] = useState(false);
    const [newCatName, setNewCatName] = useState('');

    // Drag and Drop State
    const [draggedCatId, setDraggedCatId] = useState(null);
    const [draggableId, setDraggableId] = useState(null);
    const [dropInfo, setDropInfo] = useState(null);

    // AI State
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiInsight, setAiInsight] = useState(null);

    const updateField = (field, value) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const updateLifestyleCategory = (id, newValue) => {
        setData(prev => ({
            ...prev,
            lifestyleCategories: prev.lifestyleCategories.map(cat =>
                cat.id === id ? { ...cat, value: Number(newValue) } : cat
            )
        }));
    };

    const addLifestyleCategory = (e) => {
        e.preventDefault();
        if (!newCatName.trim()) return;
        const newId = `cat_${Date.now()}`;
        const colors = ['var(--cyan-light)', 'var(--yellow-primary)', 'var(--cyan-dark)', 'var(--yellow-dark)'];
        const color = colors[data.lifestyleCategories.length % colors.length];
        setData(prev => ({
            ...prev,
            lifestyleCategories: [...prev.lifestyleCategories, {
                id: newId, label: newCatName.trim(), value: 0, color, parentId: null
            }]
        }));
        setNewCatName('');
    };

    const removeLifestyleCategory = (id) => {
        setData(prev => ({
            ...prev,
            lifestyleCategories: prev.lifestyleCategories.filter(cat => cat.id !== id && cat.parentId !== id)
        }));
    };

    // --- Tree Ordering Helper ---
    const buildOrderedList = (cats, parentId = null, depth = 0) => {
        let result = [];
        const children = cats.filter(c => (c.parentId || null) === parentId);
        children.forEach(c => {
            result.push({ ...c, depth });
            result = result.concat(buildOrderedList(cats, c.id, depth + 1));
        });
        return result;
    };
    const orderedCats = buildOrderedList(data.lifestyleCategories);

    // --- Drag and Drop Handlers ---
    const handleDragStart = (e, id) => {
        setDraggedCatId(id);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', id);
    };

    const handleDragOver = (e, targetId) => {
        e.preventDefault();
        e.stopPropagation();
        if (draggableId === targetId) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const h = rect.height;

        let position = 'inside';
        if (y < h * 0.25) position = 'before';
        else if (y > h * 0.75) position = 'after';

        setDropInfo({ targetId, position });
    };

    const handleDrop = (e, targetId) => {
        e.preventDefault();
        e.stopPropagation();
        setDropInfo(null);
        if (!draggedCatId || draggedCatId === targetId || !dropInfo) return;

        const { position } = dropInfo;
        const targetCat = data.lifestyleCategories.find(c => c.id === targetId);

        // Prevent cycle
        let current = targetCat;
        while (current) {
            if (current.id === draggedCatId) return;
            current = data.lifestyleCategories.find(c => c.id === current.parentId);
        }

        setData(prev => {
            const newCats = [...prev.lifestyleCategories];
            const draggedIdx = newCats.findIndex(c => c.id === draggedCatId);
            if (draggedIdx === -1) return prev;

            const draggedItem = { ...newCats[draggedIdx] };
            newCats.splice(draggedIdx, 1);

            const targetIdx = newCats.findIndex(c => c.id === targetId);

            if (position === 'inside') {
                draggedItem.parentId = targetId;
                newCats.splice(targetIdx + 1, 0, draggedItem);
            } else if (position === 'before') {
                draggedItem.parentId = targetCat.parentId || null;
                newCats.splice(targetIdx, 0, draggedItem);
            } else if (position === 'after') {
                draggedItem.parentId = targetCat.parentId || null;
                newCats.splice(targetIdx + 1, 0, draggedItem);
            }

            return { ...prev, lifestyleCategories: newCats };
        });
        setDraggedCatId(null);
    };

    const handleDragEnd = () => {
        setDraggedCatId(null);
        setDraggableId(null);
        setDropInfo(null);
    };

    const handleReset = () => {
        setData(demoData);
        setIsPrivate(false);
        setAiInsight(null);
    };

    const handleEasterEgg = (e) => {
        if (e.detail === 3) {
            if (isPrivate) {
                setIsPrivate(false);
                setData(demoData);
                alert("Locked Private Mode");
                return;
            }
            const password = prompt("Enter password for Private Mode:");
            if (!password) return;
            try {
                const bytes = CryptoJS.AES.decrypt(encryptedBlob, password);
                const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
                if (!decryptedStr) throw new Error("Decryption failed");
                const decryptedData = JSON.parse(decryptedStr);
                setData(decryptedData);
                setIsPrivate(true);
                alert("Private Mode Unlocked");
            } catch (error) {
                console.error(error);
                alert("Incorrect password or corrupted data.");
            }
        }
    };

    const handleSaveData = () => {
        if (!isPrivate) return;
        const password = prompt("Enter password to encrypt your current data:");
        if (!password) return;
        try {
            const newEncrypted = CryptoJS.AES.encrypt(JSON.stringify(data), password).toString();
            console.log("=== NEW ENCRYPTED BLOB ===");
            console.log(newEncrypted);
            console.log("==========================");
            alert("New encrypted blob logged to console! Please copy it and update encryptedBlob in SankeyApp.jsx manually.");
        } catch (e) {
            console.error(e);
            alert("Encryption failed.");
        }
    };

    // --- Sankey Layout Engine ---
    const sankeyData = useMemo(() => {
        const {
            grossIncome: gA, bonus: bnsA,
            parentalLoan: plA, serviceCharge: scA, bills: bA, nestPension: npA, isa: isaA,
            lifestyleCategories, studentLoanActive
        } = data;

        const iA = calculateUKIncomeTax(gA);
        const nA = calculateUKNationalInsurance(gA);
        const sAAnnual = calculateUKStudentLoan(gA, studentLoanActive);

        const m = isMonthly ? 1 / 12 : 1;
        const grossIncome = Math.round(gA * m);
        const bonus = Math.round(bnsA * m);
        const incomeTax = Math.round(iA * m);
        const ni = Math.round(nA * m);
        const studentLoan = Math.round(sAAnnual * m);
        const parentalLoan = Math.round(plA * m);
        const serviceCharge = Math.round(scA * m);
        const bills = Math.round(bA * m);
        const totalApt = parentalLoan + serviceCharge + bills;

        const scaledLifestyleCategories = lifestyleCategories.map(cat => ({
            ...cat, value: Math.round(cat.value * m)
        }));

        // Total budget from available cash is only sum of ROOT categories
        const rootCats = scaledLifestyleCategories.filter(c => !c.parentId);
        const totalLifestyle = rootCats.reduce((sum, cat) => sum + cat.value, 0);

        const nestPension = Math.round(npA * m);
        const isa = Math.round(isaA * m);
        const isaTotal = isa + bonus;

        const totalLevel1 = incomeTax + ni + studentLoan;
        const totalLevel2 = totalApt + totalLifestyle + nestPension + isa;
        const availableCashTheoretical = grossIncome - totalLevel1;
        const unallocated = availableCashTheoretical - totalLevel2;
        const deficit = unallocated < 0 ? Math.abs(unallocated) : 0;
        const surplus = unallocated > 0 ? unallocated : 0;

        const totalFlow = grossIncome + deficit + bonus;
        const availableCashActual = totalLevel2 + surplus;

        // Use CSS vars natively or mapped to equivalent hex for SVG
        const colorsMap = COLORS_MAP;

        const rawNodes = [
            { id: 'gross', label: 'Gross Income', value: grossIncome, color: colorsMap.primary, col: 0 },
            ...(bonus > 0 ? [{ id: 'bonus', label: 'Bonus (Net)', value: bonus, color: colorsMap.yellow, col: 0 }] : []),
            ...(deficit > 0 ? [{ id: 'deficit', label: 'Deficit', value: deficit, color: colorsMap.red, col: 0 }] : []),
            { id: 'tax', label: 'Income Tax', value: incomeTax, color: colorsMap.rose, col: 1 },
            { id: 'ni', label: 'Nat. Insurance', value: ni, color: colorsMap.orange, col: 1 },
            { id: 'sl', label: 'Student Loan', value: studentLoan, color: colorsMap.amber, col: 1 },
            { id: 'available', label: 'Available Cash', value: availableCashActual, color: colorsMap.blue, col: 1 },
            { id: 'apt', label: 'APT', value: totalApt, color: colorsMap.violet, col: 2 },
            { id: 'lifestyleGroup', label: 'Lifestyle & Savings', value: totalLifestyle, color: colorsMap.primary, col: 2 },
            { id: 'nest', label: 'Workplace Pension', value: nestPension, color: colorsMap.teal, col: 2 },
            { id: 'isa', label: 'ISA Investment', value: isaTotal, color: colorsMap.yellow, col: 2 },
            ...(surplus > 0 ? [{ id: 'surplus', label: 'Unallocated Buffer', value: surplus, color: colorsMap.text, col: 2 }] : []),
            { id: 'parental', label: 'Property Loan', value: parentalLoan, color: colorsMap.indigo, col: 3 },
            { id: 'serviceCharge', label: 'Service Charge', value: serviceCharge, color: colorsMap.sky, col: 3 },
            { id: 'bills', label: 'Bills', value: bills, color: colorsMap.blue, col: 3 }
        ];

        // Process nested lifestyle categories to assign columns
        let maxDepth = 0;
        const processCategory = (cat, depth) => {
            const col = 3 + depth;
            maxDepth = Math.max(maxDepth, depth);
            // Parse color for SVG if it's a CSS Variable
            let svgColor = cat.color;
            if (svgColor.includes('yellow')) svgColor = colorsMap.yellow;
            else if (svgColor.includes('cyan-light')) svgColor = colorsMap.blue;
            else if (svgColor.includes('cyan')) svgColor = colorsMap.primary;

            rawNodes.push({ id: cat.id, label: cat.label, value: cat.value, color: svgColor, col });

            const children = scaledLifestyleCategories.filter(c => c.parentId === cat.id);
            children.forEach(child => processCategory(child, depth + 1));
        };
        rootCats.forEach(cat => processCategory(cat, 0));

        const activeNodes = rawNodes.filter(n => n.value > 0);

        const WIDTH = 800;
        const HEIGHT = 600;
        const PADDING = 20;
        const NODE_WIDTH = 24;
        const NODE_SPACING = 16;

        const maxCol = 3 + maxDepth;
        const COL_X = [];
        const usableWidth = WIDTH - (PADDING * 2) - NODE_WIDTH;
        for (let i = 0; i <= maxCol; i++) {
            COL_X.push(PADDING + (i * usableWidth / Math.max(1, maxCol)));
        }

        const scaleNodesInCol = Math.max(...Array.from({ length: maxCol + 1 }, (_, i) => activeNodes.filter(n => n.col === i).length));
        const usableHeight = HEIGHT - (PADDING * 2);
        const scale = (usableHeight - (scaleNodesInCol * NODE_SPACING)) / totalFlow;

        const nodes = {};
        for (let colIndex = 0; colIndex <= maxCol; colIndex++) {
            const colNodes = activeNodes.filter(n => n.col === colIndex);
            const colTotalValue = colNodes.reduce((sum, n) => sum + n.value, 0);
            const colHeight = (colTotalValue * scale) + ((colNodes.length - 1) * NODE_SPACING);

            let currentY = PADDING + (usableHeight - colHeight) / 2;

            colNodes.forEach(node => {
                const height = Math.max(node.value * scale, 1);
                nodes[node.id] = { ...node, x: COL_X[colIndex], y: currentY, width: NODE_WIDTH, height, outY: currentY, inY: currentY };
                currentY += height + NODE_SPACING;
            });
        }

        const links = [];
        const addLink = (sourceId, targetId, value) => {
            if (value <= 0 || !nodes[sourceId] || !nodes[targetId]) return;
            const source = nodes[sourceId];
            const target = nodes[targetId];
            const linkWidth = value * scale;

            links.push({
                id: `${sourceId}-${targetId}`,
                source: sourceId,
                target: targetId,
                value,
                path: drawBezier(source.x + source.width, source.outY, target.x, target.inY, linkWidth),
                width: Math.max(linkWidth, 1),
                color: source.color
            });

            source.outY += linkWidth;
            target.inY += linkWidth;
        };

        addLink('gross', 'tax', incomeTax);
        addLink('gross', 'ni', ni);
        addLink('gross', 'sl', studentLoan);

        const grossToAvailable = grossIncome - totalLevel1;
        if (grossToAvailable > 0) addLink('gross', 'available', grossToAvailable);
        if (deficit > 0) addLink('deficit', 'available', deficit);

        addLink('available', 'apt', totalApt);
        addLink('apt', 'parental', parentalLoan);
        addLink('apt', 'serviceCharge', serviceCharge);
        addLink('apt', 'bills', bills);

        addLink('available', 'lifestyleGroup', totalLifestyle);
        rootCats.forEach(cat => {
            addLink('lifestyleGroup', cat.id, cat.value);
        });

        scaledLifestyleCategories.forEach(cat => {
            const children = scaledLifestyleCategories.filter(c => c.parentId === cat.id);
            let remainingVal = cat.value;
            children.forEach(child => {
                const linkVal = Math.min(child.value, remainingVal);
                if (linkVal > 0) {
                    addLink(cat.id, child.id, linkVal);
                    remainingVal -= linkVal;
                }
            });
        });

        addLink('available', 'nest', nestPension);
        addLink('available', 'isa', isa);
        if (bonus > 0) addLink('bonus', 'isa', bonus);
        if (surplus > 0) addLink('available', 'surplus', surplus);

        return {
            nodes: Object.values(nodes),
            links,
            totalFlow,
            deficit,
            surplus,
            incomeTax: iA,
            ni: nA,
            studentLoanAnnual: sAAnnual,
            maxCol
        };
    }, [data, isMonthly]);

    // --- AI Features ---
    const handleAIAnalysis = async () => {
        setIsAnalyzing(true);
        setAiInsight(null);
        const currentInvestments = data.isa + data.bonus + data.nestPension;

        const systemPrompt = `You are a highly advanced UK FIRE (Financial Independence, Retire Early) quantitative planner. 
    The user (Patryk) has a strict goal: Reach £750,000 in invested assets (ISA + Pension) by his mid-40s (assume exactly a 15-year investing horizon from today).
    
    Your task is to do the math and project his trajectory:
    1. Calculate his projected future net worth based on his current starting portfolio (£53,700), his current annual investment rate, and a conservative 6% real annualized return.
    2. CRITICAL FACTOR: His Student Loan will be completely paid off in exactly 2 years. Assume 100% of those freed-up annual payments are immediately redirected into his ISA for the remaining 13 years.
    3. Determine if he hits the £750k goal. If there is a shortfall, calculate the extra annual net investment needed.
    4. Based on that shortfall, tell him the exact Gross Salary he needs to target in his next career move (in 3-5 years) to generate that extra net cash, keeping UK Higher Rate (40% tax + 2% NI) bands in mind.
    5. Briefly remind him NOT to overpay his 1.1% property loan.
    
    Format the output in clean markdown with bullet points and bold numbers. Be concise, mathematically rigorous, and actionable. Do not use generic advice.`;

        const userPrompt = `
      Patryk's Current Financial Snapshot (FY26):
      - Starting Invested Net Worth: £53,700
      - Current Gross Income: £${data.grossIncome}
      - Current Annual Investments (ISA + Pension + Bonus): £${currentInvestments}
      - Student Loan Payments (Freeing up in 2 years to invest): £${sankeyData.studentLoanAnnual}/year (Active: ${data.studentLoanActive})
      - Current Unallocated Surplus (Potential extra investments): £${sankeyData.surplus}
    `;

        const result = await callGeminiAPI(userPrompt, systemPrompt);
        setAiInsight(result);
        setIsAnalyzing(false);
    };

    const formatMarkdown = (text) => {
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');

        return formattedText.split('\n').map((line, i) => {
            if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                return <li key={i} dangerouslySetInnerHTML={{ __html: line.substring(2) }} />;
            }
            if (line.trim() === '') return <br key={i} />;
            return <p key={i} dangerouslySetInnerHTML={{ __html: line }} />;
        });
    };

    const handleMouseMove = (e, content) => {
        setTooltip({ show: true, x: e.clientX, y: e.clientY, content });
    };
    const handleMouseLeave = () => setTooltip({ ...tooltip, show: false });

    // Widget Calculations
    const mDisplay = isMonthly ? 1 / 12 : 1;
    const loanTotalDisplay = Math.round(data.parentalLoan * mDisplay);
    const loanInterestDisplay = Math.round(6270 * mDisplay);
    const loanPrincipalDisplay = Math.max(0, loanTotalDisplay - loanInterestDisplay);
    const loanInterestPercent = loanTotalDisplay > 0 ? Math.min(100, (loanInterestDisplay / loanTotalDisplay) * 100) : 0;
    const loanPrincipalPercent = 100 - loanInterestPercent;

    return (
        <div className="sankey-page">

            {/* Sidebar Controls */}
            <div className="sankey-sidebar sankey-scrollbar">
                <div className="sankey-sidebar-header">
                    {/* Logo return home wrapper */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1 className="sankey-title" style={{ userSelect: 'none' }} onClick={handleEasterEgg}>
                                <Landmark style={{ color: isPrivate ? 'var(--yellow-primary)' : 'var(--cyan-primary)', cursor: 'pointer', transition: 'color 0.3s' }} />
                                Patryk's FY 2026 {isPrivate && <span style={{ fontSize: '0.45em', color: 'var(--yellow-primary)', fontWeight: 'normal', marginLeft: '8px', verticalAlign: 'middle' }}>(Private)</span>}
                            </h1>
                            <p className="sankey-subtitle">Interactive Cash Flow Simulator</p>
                        </div>
                        {/* Using the standard nav-logo component conceptually for a return home button */}
                        <a href="/" style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: '32px', height: '32px', borderRadius: '50%',
                            background: 'rgba(255, 229, 0, 0.1)', color: 'var(--yellow-primary)',
                            transition: 'all 0.15s ease'
                        }}>
                            <User size={16} />
                        </a>
                    </div>

                    <div className="sankey-toggle-group">
                        <button
                            onClick={() => setIsMonthly(false)}
                            className={`sankey-toggle-btn ${!isMonthly ? 'active' : ''}`}
                        >
                            Annual
                        </button>
                        <button
                            onClick={() => setIsMonthly(true)}
                            className={`sankey-toggle-btn ${isMonthly ? 'active' : ''}`}
                        >
                            Monthly
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <button
                            onClick={handleAIAnalysis}
                            disabled={isAnalyzing}
                            className="sankey-action-btn ai-btn"
                            style={isAnalyzing ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                        >
                            {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} style={{ color: 'var(--yellow-primary)' }} />}
                            {isAnalyzing ? 'Analyzing Budget...' : 'AI Health Check'}
                        </button>

                        <button
                            onClick={handleReset}
                            className="sankey-action-btn reset-btn"
                        >
                            <RefreshCw size={12} /> Reset Data
                        </button>
                        {isPrivate && (
                            <button
                                onClick={handleSaveData}
                                className="sankey-action-btn"
                                style={{ background: 'rgba(255, 229, 0, 0.1)', color: 'var(--yellow-primary)', border: '1px solid rgba(255, 229, 0, 0.3)', marginTop: '4px' }}
                            >
                                Save Private Data (Log to Console)
                            </button>
                        )}
                    </div>
                </div>

                <div className="sankey-sidebar-content">
                    <section>
                        <h2 className="sankey-section-title">
                            <Briefcase size={14} /> Income
                        </h2>
                        <InputField label="Gross Income" field="grossIncome" icon={Briefcase} colorVar="var(--cyan-light)" data={data} isMonthly={isMonthly} updateField={updateField} />
                        <InputField label="Bonus (Net)" field="bonus" icon={Briefcase} colorVar="var(--yellow-primary)" data={data} isMonthly={isMonthly} updateField={updateField} hint="After tax input. Connects directly to ISA." />
                    </section>

                    <section>
                        <h2 className="sankey-section-title">
                            <Receipt size={14} /> Taxes & Deductions
                        </h2>
                        <p className="sankey-field-hint" style={{ marginTop: '-12px', marginBottom: '16px' }}>
                            Income tax and National Insurance are auto-calculated based on UK bands.
                        </p>
                        <CalculatedField label="Income Tax" value={calculateUKIncomeTax(data.grossIncome)} icon={Receipt} colorVar={COLORS_MAP.rose} isMonthly={isMonthly} />
                        <CalculatedField label="National Insurance" value={calculateUKNationalInsurance(data.grossIncome)} icon={Receipt} colorVar={COLORS_MAP.orange} isMonthly={isMonthly} />

                        <ToggleField
                            label="Student Loan"
                            value={calculateUKStudentLoan(data.grossIncome)}
                            isActive={data.studentLoanActive}
                            onToggle={() => updateField('studentLoanActive', !data.studentLoanActive)}
                            icon={Receipt}
                            colorVar="var(--yellow-dark)"
                            isMonthly={isMonthly}
                            hint="Plan 2: ~9% on earnings over £27,295"
                        />
                    </section>

                    <section>
                        <h2 className="sankey-section-title">
                            <Home size={14} /> Fixed Core Expenses
                        </h2>
                        <InputField label="Property Loan" field="parentalLoan" icon={Home} colorVar="var(--white)" data={data} isMonthly={isMonthly} updateField={updateField} />
                        <InputField label="Service Charge" field="serviceCharge" icon={Home} colorVar={COLORS_MAP.sky} data={data} isMonthly={isMonthly} updateField={updateField} />
                        <InputField label="Bills" field="bills" icon={Zap} colorVar="var(--cyan-dark)" data={data} isMonthly={isMonthly} updateField={updateField} />
                    </section>

                    <section>
                        <h2 className="sankey-section-title">
                            <PiggyBank size={14} /> Lifestyle & Savings
                        </h2>

                        <div className="sankey-category-container">
                            {orderedCats.map((cat) => {
                                const canRemove = cat.id !== 'cat_lifestyle' && cat.id !== 'cat_travel';
                                return (
                                    <div
                                        key={cat.id}
                                        className="sankey-category-item"
                                        draggable={draggableId === cat.id}
                                        onDragStart={(e) => handleDragStart(e, cat.id)}
                                        onDragOver={(e) => handleDragOver(e, cat.id)}
                                        onDrop={(e) => handleDrop(e, cat.id)}
                                        onDragLeave={() => setDropInfo(null)}
                                        onDragEnd={handleDragEnd}
                                        style={{
                                            paddingLeft: `${cat.depth * 1.25}rem`,
                                            opacity: draggedCatId === cat.id ? 0.3 : 1
                                        }}
                                    >
                                        {dropInfo?.targetId === cat.id && dropInfo.position === 'before' && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'var(--cyan-primary)', borderRadius: '2px', zIndex: 10 }} />}
                                        {dropInfo?.targetId === cat.id && dropInfo.position === 'inside' && <div style={{ position: 'absolute', inset: 0, border: '2px solid var(--cyan-primary)', borderRadius: '4px', pointerEvents: 'none', zIndex: 10 }} />}
                                        {dropInfo?.targetId === cat.id && dropInfo.position === 'after' && <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px', background: 'var(--cyan-primary)', borderRadius: '2px', zIndex: 10 }} />}

                                        <CategoryField
                                            label={cat.label}
                                            value={cat.value}
                                            icon={Plane}
                                            colorHex={cat.color}
                                            isMonthly={isMonthly}
                                            onChange={(val) => updateLifestyleCategory(cat.id, val)}
                                            onRemove={canRemove ? () => removeLifestyleCategory(cat.id) : null}
                                            onGripEnter={() => setDraggableId(cat.id)}
                                            onGripLeave={() => setDraggableId(null)}
                                        />
                                    </div>
                                );
                            })}

                            <form onSubmit={addLifestyleCategory} className="sankey-add-category-form">
                                <input
                                    type="text"
                                    placeholder="Add new category..."
                                    value={newCatName}
                                    onChange={(e) => setNewCatName(e.target.value)}
                                    className="sankey-add-input"
                                />
                                <button
                                    type="submit"
                                    disabled={!newCatName.trim()}
                                    className="sankey-add-btn"
                                >
                                    <Plus size={14} /> Add
                                </button>
                            </form>
                        </div>

                        <InputField label="Workplace Pension" field="nestPension" icon={PiggyBank} colorVar={COLORS_MAP.teal} data={data} isMonthly={isMonthly} updateField={updateField} />
                        <InputField label="ISA Investment" field="isa" icon={PiggyBank} colorVar="var(--yellow-primary)" data={data} isMonthly={isMonthly} updateField={updateField} />
                    </section>
                </div>
            </div>

            {/* Main Chart Area */}
            <div className="sankey-main">

                {/* Top Widgets Bar */}
                <div className="sankey-widgets-bar">

                    {/* Left Side: ISA & Loan Health */}
                    <div className="sankey-widget-group">
                        {/* ISA Progress Banner */}
                        <div className="sankey-widget">
                            <div className="sankey-widget-header">
                                <span className="sankey-widget-title"><PiggyBank size={14} style={{ color: 'var(--cyan-light)' }} /> ISA FY26 Usage</span>
                                <span className="sankey-widget-value" style={{ color: 'var(--cyan-light)' }}>{formatGBP(data.isa + data.bonus)} <span style={{ color: 'var(--grey-text)', fontWeight: 400 }}>/ £20k</span></span>
                            </div>
                            <div className="sankey-progress-bar">
                                <div className="sankey-progress-fill" style={{ backgroundColor: 'var(--cyan-light)', width: `${Math.min(((data.isa + data.bonus) / 20000) * 100, 100)}%` }}></div>
                            </div>
                        </div>

                        {/* Parental Loan Breakdown Widget */}
                        <div className="sankey-widget">
                            <div className="sankey-widget-header">
                                <span className="sankey-widget-title"><Home size={14} style={{ color: 'var(--white)' }} /> Property Loan</span>
                                <span style={{ color: 'var(--grey-text)', fontSize: '0.625rem' }}>£570k @ 1.1%</span>
                            </div>

                            <div className="sankey-progress-bar">
                                <div className="sankey-progress-fill" style={{ backgroundColor: 'var(--yellow-dark)', width: `${loanInterestPercent}%` }}></div>
                                <div className="sankey-progress-fill" style={{ backgroundColor: 'var(--cyan-primary)', width: `${loanPrincipalPercent}%` }}></div>
                            </div>

                            <div className="sankey-widget-details">
                                <span className="sankey-detail-item">
                                    <span className="sankey-dot" style={{ backgroundColor: 'var(--yellow-dark)' }}></span>
                                    Interest: <span style={{ color: 'var(--white)', fontWeight: 600 }}>{formatGBP(loanInterestDisplay)}</span>
                                </span>
                                <span className="sankey-detail-item">
                                    <span className="sankey-dot" style={{ backgroundColor: 'var(--cyan-primary)' }}></span>
                                    Principal: <span style={{ color: 'var(--white)', fontWeight: 600 }}>{formatGBP(loanPrincipalDisplay)}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Status Banner for Deficit/Surplus */}
                    <div className="sankey-widget-group" style={{ justifyContent: 'flex-end' }}>
                        {sankeyData.nodes.find(n => n.id === 'deficit') && (
                            <div className="sankey-alert deficit">
                                <AlertCircle size={16} /> Over Budget by {formatGBP(sankeyData.nodes.find(n => n.id === 'deficit').value)}
                            </div>
                        )}
                        {sankeyData.nodes.find(n => n.id === 'surplus') && (
                            <div className="sankey-alert surplus">
                                <PiggyBank size={16} /> Unallocated Buffer: {formatGBP(sankeyData.nodes.find(n => n.id === 'surplus').value)}
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Insight Modal Overlay */}
                {aiInsight && (
                    <>
                        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 15 }} onClick={() => setAiInsight(null)}></div>
                        <div className="sankey-ai-modal">
                            <div className="sankey-ai-header">
                                <h3 className="sankey-ai-title">
                                    <Sparkles size={20} style={{ color: 'var(--cyan-primary)' }} /> AI Financial Review
                                </h3>
                                <button onClick={() => setAiInsight(null)} className="sankey-ai-close">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="sankey-ai-content sankey-scrollbar">
                                {formatMarkdown(aiInsight)}
                            </div>
                        </div>
                    </>
                )}

                <div className={`sankey-chart-wrapper ${aiInsight ? 'analyzing' : ''}`}>
                    <svg viewBox="0 0 800 600" className="sankey-svg">
                        {/* Draw Links */}
                        <g className="links">
                            {sankeyData.links.map(link => {
                                const sourceNode = sankeyData.nodes.find(n => n.id === link.source);
                                const targetNode = sankeyData.nodes.find(n => n.id === link.target);
                                return (
                                    <path
                                        key={link.id}
                                        d={link.path}
                                        fill="none"
                                        stroke={link.color}
                                        strokeWidth={link.width}
                                        strokeOpacity={0.3}
                                        className="sankey-link"
                                        onMouseMove={(e) => handleMouseMove(e, {
                                            title: `${sourceNode.label} → ${targetNode.label}`,
                                            value: link.value,
                                            percent: ((link.value / sankeyData.totalFlow) * 100).toFixed(1),
                                            parentText: sourceNode.label,
                                            parentPercent: ((link.value / sourceNode.value) * 100).toFixed(1)
                                        })}
                                        onMouseLeave={handleMouseLeave}
                                    />
                                );
                            })}
                        </g>

                        {/* Draw Nodes */}
                        <g className="nodes">
                            {sankeyData.nodes.map(node => {
                                const incomingLinks = sankeyData.links.filter(l => l.target === node.id);
                                let parentText = null;
                                let parentPercent = null;

                                if (incomingLinks.length > 0) {
                                    const primaryLink = incomingLinks.reduce((max, link) => link.value > max.value ? link : max, incomingLinks[0]);
                                    const parentNode = sankeyData.nodes.find(n => n.id === primaryLink.source);
                                    if (parentNode) {
                                        parentText = parentNode.label;
                                        parentPercent = ((node.value / parentNode.value) * 100).toFixed(1);
                                    }
                                }

                                return (
                                    <g key={node.id}
                                        className="sankey-node"
                                        onMouseMove={(e) => handleMouseMove(e, {
                                            title: node.label,
                                            value: node.value,
                                            percent: ((node.value / sankeyData.totalFlow) * 100).toFixed(1),
                                            parentText,
                                            parentPercent
                                        })}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        <rect
                                            x={node.x}
                                            y={node.y}
                                            width={node.width}
                                            height={node.height}
                                            fill={node.color}
                                            rx={4}
                                        />
                                        {/* Labels */}
                                        <text
                                            x={node.col === 0 ? node.x - 10 : node.col === sankeyData.maxCol ? node.x + node.width + 10 : node.x + node.width / 2}
                                            y={node.y + node.height / 2}
                                            dy="0.35em"
                                            textAnchor={node.col === 0 ? "end" : node.col === sankeyData.maxCol ? "start" : "middle"}
                                            fill="var(--white)"
                                            fontSize={node.height < 20 ? "10" : "12"}
                                            fontWeight="500"
                                            style={{ pointerEvents: 'none', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                                        >
                                            {node.label}
                                        </text>
                                        {/* Value Sub-labels */}
                                        {(node.col === 0 || node.col === sankeyData.maxCol) && node.height > 25 && (
                                            <text
                                                x={node.col === 0 ? node.x - 10 : node.x + node.width + 10}
                                                y={node.y + node.height / 2 + 14}
                                                textAnchor={node.col === 0 ? "end" : "start"}
                                                fill="var(--grey-text)"
                                                fontSize="10"
                                                style={{ pointerEvents: 'none' }}
                                            >
                                                {formatGBP(node.value)}
                                            </text>
                                        )}
                                    </g>
                                );
                            })}
                        </g>
                    </svg>
                </div>
            </div>

            {/* Floating Tooltip */}
            {tooltip.show && tooltip.content && (
                <div
                    className="sankey-tooltip"
                    style={{ left: tooltip.x, top: tooltip.y }}
                >
                    <div className="sankey-tooltip-title">{tooltip.content.title}</div>
                    <div className="sankey-tooltip-row">
                        <span className="sankey-tooltip-label">Amount:</span>
                        <span className="sankey-tooltip-val primary">{formatGBP(tooltip.content.value)} {isMonthly ? '/mo' : '/yr'}</span>
                    </div>
                    <div className="sankey-tooltip-row">
                        <span className="sankey-tooltip-label">% of Gross:</span>
                        <span className="sankey-tooltip-val secondary">{tooltip.content.percent}%</span>
                    </div>
                    {tooltip.content.parentText && tooltip.content.parentText !== 'Gross Income' && (
                        <div className="sankey-tooltip-row" style={{ marginTop: '4px' }}>
                            <span className="sankey-tooltip-label">% of {tooltip.content.parentText}:</span>
                            <span className="sankey-tooltip-val">{tooltip.content.parentPercent}%</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
