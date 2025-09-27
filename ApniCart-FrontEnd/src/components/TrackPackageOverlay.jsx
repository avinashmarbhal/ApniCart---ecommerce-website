import React from "react";

const statusSteps = [
  { label: "Ordered", key: "placed" },
  { label: "Shipped", key: "shipped" },
  { label: "Out for delivery", key: "out for delivery" },
  { label: "Delivered", key: "delivered" },
];

const TrackPackageOverlay = ({ currentStatus = "placed", onClose }) => {
  const currentIndex = statusSteps.findIndex((s) => s.key === currentStatus);
  const isCancelled = currentStatus === "cancelled";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center px-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg relative shadow-lg">
        {/* Close Button */}
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
          onClick={onClose}
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-center mb-8 capitalize">
          {isCancelled ? "Order Cancelled" : statusSteps[currentIndex]?.label}
        </h2>

        {/* Progress Steps */}
        {!isCancelled ? (
          <div className="relative flex justify-between items-center mb-6 px-3">
            {/* Grey background line */}
            <div className="absolute top-[12px] left-0 right-0 h-1 bg-gray-300 rounded-full z-0" />

            {/* Teal progress line */}
            <div
              className="absolute top-[12px] left-0 h-1 bg-teal-500 rounded-full z-10 transition-all duration-300"
              style={{
                width: `${(currentIndex / (statusSteps.length - 1)) * 100}%`,
              }}
            />

            {/* Steps */}
            {statusSteps.map((step, index) => {
              const isActive = index <= currentIndex;
              const isCurrent = index === currentIndex;

              return (
                <div
                  key={step.key}
                  className="flex flex-col items-center z-20 flex-1"
                >
                  <div
                    className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${
                      isActive
                        ? "bg-teal-500 border-teal-500 text-white"
                        : "bg-white border-gray-400 text-gray-400"
                    }`}
                  >
                    ✓
                  </div>
                  <span
                    className={`mt-2 text-sm text-center leading-tight ${
                      isCurrent
                        ? "text-black font-semibold"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-red-600 text-base font-semibold mt-4">
            ❌ This order has been cancelled.
          </p>
        )}

        {/* Action Buttons */}
        {!isCancelled && (
          <div className="flex gap-4 mt-6">
            <button className="flex-1 border border-gray-400 rounded py-2 text-sm hover:bg-gray-100 transition">
              Update delivery instructions
            </button>
            <button className="flex-1 border border-gray-400 rounded py-2 text-sm hover:bg-gray-100 transition">
              Buy again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackPackageOverlay;
