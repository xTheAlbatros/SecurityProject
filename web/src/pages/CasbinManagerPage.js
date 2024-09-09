import React, { useEffect, useRef } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import { useNavigate } from "react-router-dom";
import * as Setting from "../Setting";

const CasbinManager = () => {
    const rolesTableRef = useRef(null);
    const usersTableRef = useRef(null);
    const rolesTableInstance = useRef(null);
    const usersTableInstance = useRef(null);
    const apiBaseUrl = "http://localhost:8083";
    const navigate = useNavigate();

    useEffect(() => {
        if (!Setting.isLoggedIn()) {
            navigate("/");
        }

        const token = localStorage.getItem("token");

        function transformData(data) {
            return data.map(row => ({
                id: row.id,
                ptype: row.ptype,
                v0: row.v0 ? (typeof row.v0 === 'object' ? row.v0.String || "" : row.v0) : "",
                v1: row.v1 ? (typeof row.v1 === 'object' ? row.v1.String || "" : row.v1) : "",
                v2: row.v2 ? (typeof row.v2 === 'object' ? row.v2.String || "" : row.v2) : "",
                v3: row.v3 ? (typeof row.v3 === 'object' ? row.v3.String || "" : row.v3) : "",
                v4: row.v4 ? (typeof row.v4 === 'object' ? row.v4.String || "" : row.v4) : "",
                v5: row.v5 ? (typeof row.v5 === 'object' ? row.v5.String || "" : row.v5) : ""
            }));
        }

        const fetchTableData = async (tableRef, ptype, tableInstanceRef) => {
            try {
                const response = await fetch(`${apiBaseUrl}/api/rules`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) throw new Error("Failed to fetch data");
                const data = await response.json();
                const transformedData = transformData(data).filter(row => row.ptype === ptype);

                const table = new Tabulator(tableRef.current, {
                    data: transformedData,
                    layout: "fitColumns",
                    columns: [
                        { title: ptype === "p" ? "Role" : "User", field: "v0", editor: "input" },
                        { title: ptype === "p" ? "Permission" : "Role", field: "v1", editor: "input" },
                        ...(ptype === "p" ? [{ title: "Method", field: "v2", editor: "input" }] : []),
                        {
                            title: "Actions",
                            formatter: "buttonCross",
                            width: 100,
                            cellClick: async (e, cell) => {
                                const { id } = cell.getRow().getData();
                                try {
                                    const deleteResponse = await fetch(`${apiBaseUrl}/api/rules/${id}`, {
                                        method: "DELETE",
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                        },
                                    });
                                    if (!deleteResponse.ok) throw new Error("Failed to delete rule");
                                    cell.getRow().delete();
                                } catch (error) {
                                    console.error('Failed to delete rule:', error);
                                }
                            }
                        }
                    ]
                });

                tableInstanceRef.current = table;

                table.on("cellEdited", async (cell) => {
                    const data = cell.getRow().getData();

                    const payload = {
                        id: data.id,
                        ptype: data.ptype,
                        v0: data.v0 || "",
                        v1: data.v1 || "",
                        v2: data.v2 || "",
                        v3: data.v3 || "",
                        v4: data.v4 || "",
                        v5: data.v5 || ""
                    };

                    try {
                        const updateResponse = await fetch(`${apiBaseUrl}/api/rules/${data.id}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify(payload)
                        });
                        if (!updateResponse.ok) throw new Error("Failed to update rule");
                        const result = await updateResponse.json();
                        if (result.status === 'rule updated') {
                            console.log('Rule updated successfully');
                        }
                    } catch (error) {
                        console.error('Failed to update rule:', error);
                    }
                });

            } catch (error) {
                console.error('Error fetching table data:', error);
            }
        };

        fetchTableData(rolesTableRef, "p", rolesTableInstance);
        fetchTableData(usersTableRef, "g", usersTableInstance);

    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = {
            ptype: formData.get("ptype"),
            v0: formData.get("v0") || "",
            v1: formData.get("v1") || "",
            v2: formData.get("v2") || "",
            v3: formData.get("v3") || "",
            v4: formData.get("v4") || "",
            v5: formData.get("v5") || ""
        };

        const token = localStorage.getItem("token");

        function transformData(data) {
            return data.map(row => ({
                id: row.id,
                ptype: row.ptype,
                v0: row.v0 ? (typeof row.v0 === 'object' ? row.v0.String || "" : row.v0) : "",
                v1: row.v1 ? (typeof row.v1 === 'object' ? row.v1.String || "" : row.v1) : "",
                v2: row.v2 ? (typeof row.v2 === 'object' ? row.v2.String || "" : row.v2) : "",
                v3: row.v3 ? (typeof row.v3 === 'object' ? row.v3.String || "" : row.v3) : "",
                v4: row.v4 ? (typeof row.v4 === 'object' ? row.v4.String || "" : row.v4) : "",
                v5: row.v5 ? (typeof row.v5 === 'object' ? row.v5.String || "" : row.v5) : ""
            }));
        }

        try {
            const response = await fetch(`${apiBaseUrl}/api/rules`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.status === 'rule added') {

                if (rolesTableInstance.current) {
                    const fetchDataResponse = await fetch(`${apiBaseUrl}/api/rules`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const fetchedData = await fetchDataResponse.json();
                    const transformedData = transformData(fetchedData).filter(row => row.ptype === 'p');
                    rolesTableInstance.current.setData(transformedData);
                }
                if (usersTableInstance.current) {
                    const fetchDataResponse = await fetch(`${apiBaseUrl}/api/rules`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const fetchedData = await fetchDataResponse.json();
                    const transformedData = transformData(fetchedData).filter(row => row.ptype === 'g');
                    usersTableInstance.current.setData(transformedData);
                }
            } else {
                console.error('Failed to add rule');
            }
        } catch (error) {
            console.error('Error adding rule:', error);
        }
    };

    return (
        <div>
            <h1>Roles and Permissions</h1>
            <div ref={rolesTableRef}></div>

            <h1>Users and Roles</h1>
            <div ref={usersTableRef}></div>

            <h2>Add New Rule</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="ptype">Type:</label>
                <select id="ptype" name="ptype">
                    <option value="p">Policy</option>
                    <option value="g">Grouping</option>
                </select><br />

                <label htmlFor="v0">v0:</label>
                <input type="text" id="v0" name="v0" /><br />

                <label htmlFor="v1">v1:</label>
                <input type="text" id="v1" name="v1" /><br />

                <label htmlFor="v2">v2:</label>
                <input type="text" id="v2" name="v2" /><br />

                <label htmlFor="v3">v3:</label>
                <input type="text" id="v3" name="v3" /><br />

                <label htmlFor="v4">v4:</label>
                <input type="text" id="v4" name="v4" /><br />

                <label htmlFor="v5">v5:</label>
                <input type="text" id="v5" name="v5" /><br />

                <button type="submit">Add Rule</button>
            </form>
        </div>
    );
};

export default CasbinManager;
