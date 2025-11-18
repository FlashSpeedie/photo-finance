import { useState, useEffect } from "react";
import { LuPlus, LuScan } from "react-icons/lu";
import { prepareExpenseLineChartData } from "../../utils/helper";
import CustomLineChart from "../Charts/CustomLineChart";
import { toast } from "react-hot-toast";

const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = (error) => reject(error);
    });
};

const ScanReceiptModal = ({ isOpen, onClose, onSubmit }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    if (!isOpen) return null;

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setSelectedImage(null);
            setPreviewUrl('');
        }
    };

    const handleSubmit = async () => {
        if (selectedImage) {
            setIsSubmitting(true);

            try {
                await onSubmit(selectedImage);
                setSelectedImage(null);
                setPreviewUrl('');
                onClose();
                toast.success("Receipt scanned and expense added!");
            } catch (error) {
                console.error("Submission failed:", error);
                toast.error("Failed to process receipt. Check console for API errors.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
                <h5 className="text-xl font-semibold mb-4">Scan Receipt</h5>

                <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleImageChange}
                    className="mb-4 block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100 cursor-pointer"
                    disabled={isSubmitting}
                />

                {previewUrl && (
                    <div className="mb-4 border border-gray-300 p-2 rounded max-h-60 overflow-y-auto">
                        <p className="text-sm text-gray-600 mb-2 font-medium">Preview:</p>
                        <img src={previewUrl} alt="Receipt Preview" className="w-full h-auto object-contain" />
                    </div>
                )}

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        onClick={handleSubmit}
                        disabled={!selectedImage || isSubmitting}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Analyzing...
                            </div>
                        ) : (
                            'Submit'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ExpenseOverview = (props) => {
    const { transactions, onAddExpense, onExpenseSubmit } = props;
    const [chartData, setChartData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const result = prepareExpenseLineChartData(transactions);
        setChartData(result);
    }, [transactions]);

    const handleScanReceipt = () => {
        setIsModalOpen(true);
    };

    const handleImageUpload = async (imageFile) => {
        try {
            const base64Image = await fileToBase64(imageFile);
            const GEMINI_API_KEY = "AIzaSyAr0tvn6cFt3LXhsG8conozatxLUe_Ft50";
            const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

            const payload = {
                contents: [
                    {
                        parts: [
                            {
                                inlineData: {
                                    mimeType: imageFile.type,
                                    data: base64Image,
                                },
                            },
                            {
                                text: "You are an expert financial OCR assistant. Analyze the image of the receipt and extract the total amount, the date, and a brief description of the primary category. Respond ONLY with a single JSON object matching the schema: {category: string, amount: number, date: string (YYYY-MM-DD format)}. Use the TOTAL amount. If the decimal separator is a comma, convert it to a dot. Suggest a descriptive category.",
                            },
                        ],
                    },
                ],
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "object",
                        properties: {
                            category: { type: "string" },
                            amount: { type: "number" },
                            date: { type: "string", format: "date" },
                        },
                        required: ["category", "amount", "date"],
                    },
                    temperature: 0.1,
                },
            };

            const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                try {
                    const errorJson = JSON.parse(errorBody);
                    throw new Error(`Gemini API error! Status: ${response.status}. Body: ${errorJson.error.message || errorBody}`);
                } catch (e) {
                    throw new Error(`Gemini API error! Status: ${response.status}. Body: ${errorBody}`);
                }
            }

            const data = await response.json();
            const jsonString = data.candidates[0].content.parts[0].text.trim();
            const extractedData = JSON.parse(jsonString);

            const expenseData = {
                category: extractedData.category || "Uncategorized",
                amount: String(Number(extractedData.amount || 0).toFixed(2)),
                date: extractedData.date || new Date().toISOString().split('T')[0],
                icon: "https://img.icons8.com/glyph-neue/1200/portrait-mode-scanning.jpg",
            };

            console.log('Extracted Data:', expenseData);

            if (onExpenseSubmit) {
                onExpenseSubmit(expenseData);
            }

        } catch (error) {
            console.error("Failed to process receipt:", error);
            throw error;
        }
    };

    return (
        <>
            <div className="card">
                <div className="flex items-center justify-between">
                    <div className="">
                        <h5 className="text-lg">Expense Overview</h5>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Track your spending trends over time and gain insights into where your money goes.
                        </p>
                    </div>

                    <div className="flex space-x-3">
                        <button className="add-btn" onClick={handleScanReceipt}>
                            <LuScan className="text-lg" />
                            Scan Receipt
                        </button>

                        <button className="add-btn" onClick={onAddExpense}>
                            <LuPlus className="text-lg" />
                            Add Expense
                        </button>
                    </div>
                </div>

                <div className="mt-10">
                    <CustomLineChart data={chartData} />
                </div>
            </div>

            <ScanReceiptModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleImageUpload}
            />
        </>
    );
};

export default ExpenseOverview;
