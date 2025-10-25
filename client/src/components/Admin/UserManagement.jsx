import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../../redux/slices/adminSlice"
import { updateUser } from "../../redux/slices/adminSlice"
import { deleteUser } from "../../redux/slices/adminSlice"
import { fetchUsers } from "../../redux/slices/adminSlice"

const UserManagement = () => {
 const dispatch = useDispatch();
 const navigate = useNavigate();

 const { user } = useSelector((state) => state.auth);
 const { users, loading, error  } = useSelector((state) => state.admin);

 useEffect(()=> {
  if (user && user.role !== "admin") {
    navigate("/")
  }
 },[user, navigate])

 useEffect(() => {
  if (user && user.role === "admin") {
    dispatch(fetchUsers())
  }
 },[dispatch,user])
 

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer", // Default role
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // ✅ moved before console.log
   dispatch(addUser(formData));

    setFormData({
      name: "",
      email: "",
      password: "",
      role: "customer",
    });
  };

  const handleRolechange = (userId, newRole) => {
    dispatch(updateUser({id: userId, role: newRole }));
  };

  const handleDeleteuser = (userId) => {
    if (window.confirm("Are you sure you want to Delete this user")) {
     dispatch(deleteUser(userId))
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        User Management
      </h1>
      {loading && <p>Loading...</p>}
      {error && <p>error: {error}</p> }
      {/* Add User Form */}
      <div className="p-6 bg-white shadow rounded-2xl mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          Add New User
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-black focus:outline-none"
            value={formData.name}
            required
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-black focus:outline-none"
            value={formData.email}
            required
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-black focus:outline-none"
            value={formData.password}
            required
            onChange={handleChange}
          />

          <select
            name="role"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-black focus:outline-none"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            className="px-4 bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600" // ✅ removed stray 'n'
          >
            Add User
          </button>
        </form>
      </div>

      {/* Users List */}
      <div className="overflow-x-auto p-6 bg-white shadow-md rounded-2xl">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* ❌ FIXED: wrapped in {} */}
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b hover:bg-gray-50"
              >
                <td className="px-4 py-3 text-gray-900 whitespace-nowrap">
                  {user.name}
                </td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">
                  <select
                    className="p-2 border rounded"
                    value={user.role}
                    onChange={(e) =>
                      handleRolechange(user._id, e.target.value)
                    }
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-4">
                  {/* ❌ FIXED: roun\ → rounded */}
                  <button
                    onClick={() => handleDeleteuser(user._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
