export const OptionCard = ({ text, selected, onClick }) => (
    <div
        onClick={onClick}
        className={`
            relative cursor-pointer rounded-lg border p-4
            transition-all duration-200 ease-in-out
            ${selected 
                ? 'border-blue-500 bg-blue-100' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }
        `}
    >
        <div className="flex items-center justify-between">
            <span className="font-medium">{text}</span>
        </div>
    </div>
);