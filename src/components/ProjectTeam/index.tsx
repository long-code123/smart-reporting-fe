"use client";

import React, { useEffect, useState } from "react";
import { Card, Table, Spin, Button, message } from "antd";
import AppLayout from "@/components/layout";
import { getResources } from "@/api/resourceAPI";
import { getProjects } from "@/api/projectAPI";
import { EditOutlined } from "@ant-design/icons"; // Import Edit icon
import { ColumnsType } from "antd/es/table"; // Import ColumnsType

interface Project {
  _id: string;
  projectName: string;
}

interface Resource {
  _id: string;
  name: string;
  projects: string[];
}

interface DataRecord {
  resourceName: string;
  [key: string]: any; // Allow dynamic keys for project names
}

const ProjectTeam = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resourcesData, projectsData] = await Promise.all([
          getResources(),
          getProjects(),
        ]);

        setResources(resourcesData);
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Spin size="large" />;
  if (error) return <div>{error}</div>;

  // Tạo bản đồ dự án để tra cứu tên dự án từ ID
  const projectMap = new Map(projects.map(project => [project._id, project.projectName]));
  console.log("Project Map:", Array.from(projectMap.entries()));

  // Cập nhật dữ liệu nguồn cho bảng
  const dataSource: DataRecord[] = resources.map(resource => {
    const projectStatuses = projects.reduce((acc, project) => {
      acc[project.projectName] = resource.projects.includes(project._id) ? "X" : "";
      return acc;
    }, {} as Record<string, string>);
    
    return {
      resourceName: resource.name,
      ...projectStatuses,
    };
  });

  // Cấu hình cột của bảng
  const columns: ColumnsType<DataRecord> = [
    {
      title: "Resource Name",
      dataIndex: "resourceName",
      key: "resourceName",
      fixed: "left", // Fixed column at the end
      width: 200,
      align: "center", // Center align the text
    },
    ...projects.map(project => ({
      title: project.projectName,
      dataIndex: project.projectName,
      key: project._id,
      width: 150,
      align: "center" as const, // Ensure align is a valid AlignType
      render: (text: string) => (
        <div style={{ textAlign: "center" }}>{text || ""}</div>
      ),
    })),
    {
      title: "Action",
      key: "action",
      width: 100,
      fixed: "right", // Fixed column at the end
      render: (_: any, record: DataRecord) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => handleUpdate(record)}
        />
      ),
    },
  ];

  const handleUpdate = (record: DataRecord) => {
    // Placeholder for the update handler
    message.info(`Updating ${record.resourceName}`);
  };

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <AppLayout activeMenuKey="/project-team">
      <div>
        <Table
          columns={columns}
          dataSource={dataSource.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
          rowKey={record => `${record.resourceName}`}
          pagination={{
            current: currentPage,
            pageSize,
            total: resources.length,
            onChange: handleChangePage,
          }}
          scroll={{ x: 'max-content' }} // Thêm thanh cuộn ngang nếu cần
          className="custom-table" // Áp dụng lớp CSS cho bảng
        />
      </div>
    </AppLayout>
  );
  
};

export default ProjectTeam;
