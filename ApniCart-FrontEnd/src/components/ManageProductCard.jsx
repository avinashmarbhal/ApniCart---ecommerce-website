import React from "react";

const ManageProductCard = ({ image, name, quantity, onEdit, onDelete, isDeleting }) => {
  return (
    <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="bg-blue-50 p-4 flex justify-center items-center">
        <img
          src={image || "/altImg.png"}
          alt={name}
          className="w-40 h-40 object-cover "
        />
      </div>

      <div className="px-4 py-3">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-600">Quantity: {quantity}</p>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onEdit}
            className="px-4 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-sm text-gray-700"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="px-4 py-1.5 rounded bg-red-100 hover:bg-red-200 text-sm text-red-700 disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageProductCard;
