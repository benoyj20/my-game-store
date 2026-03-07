function Notification({ message, type, onClose }) {
    if (!message) return null;

    const backgroundColor = type === "success" ? "#2e7d32" : "#d32f2f";

    return (
        <div
            style={{
                padding: "16px 20px",
                borderRadius: "8px",
                backgroundColor,
                color: "white",
                boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                zIndex: 9999,
                fontFamily: "Roboto, sans-serif",      
                fontSize: "1rem",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                minWidth: "280px",
            }}
        >
            <span style={{ flexGrow: 1 }}>{message}</span>

            <button
                onClick={onClose}
                style={{
                    marginLeft: "16px", 
                    color: "white",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1.4rem",
                    fontWeight: "bold",
                    lineHeight: 1,
                }}
            >
                &times;
            </button>
        </div>
    );
}

export default Notification;
        
        
