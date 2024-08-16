"use client";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/api/projectAPI";
import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Progress,
} from "antd";
import type { TableProps } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import AppLayout from "@/components/layout";
import moment from "moment";

const { Option } = Select;

interface Project {
  _id: string;
  projectName: string;
  status: string;
  leader: string;
  members: string[];
  cost: number;
  progress: number; // Giả sử đây là phần trăm từ 0 đến 100
  startDate: string;
  endDate: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"create" | "update">("create");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsData = await getProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this project?",
      content: "This action cannot be undone.",
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteProject(id);
          setProjects(projects.filter((project) => project._id !== id));
          message.success("Project deleted successfully.");
        } catch (error) {
          console.error("Error deleting project:", error);
          message.error("Failed to delete project.");
        }
      },
    });
  };

  const handleCreate = () => {
    setModalType("create");
    setSelectedProject(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleUpdate = (project: Project) => {
    setModalType("update");
    setSelectedProject(project);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...project,
      startDate: moment(project.startDate),
      endDate: moment(project.endDate),
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      if (modalType === "create") {
        // Exclude members field when creating a new project
        const { members, ...projectData } = values;
        await createProject(projectData);
        message.success("Project created successfully.");
      } else if (modalType === "update" && selectedProject) {
        // Keep the existing members if not changed
        const { members, ...projectData } = values;
        const updatedValues = { ...projectData, members: selectedProject.members };
        await updateProject(selectedProject._id, updatedValues);
        message.success("Project updated successfully.");
      }
  
      const projectsData = await getProjects();
      setProjects(projectsData);
      setIsModalVisible(false);
    } catch (error) {
      console.error(
        `Error ${modalType === "create" ? "creating" : "updating"} project:`,
        error
      );
      message.error(
        `Failed to ${modalType === "create" ? "create" : "update"} project.`
      );
    }
  };

  const columns: TableProps<Project>['columns'] = [
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
      fixed: 'left',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
    },
    {
      title: 'Leader',
      dataIndex: 'leader',
      key: 'leader',
      width: 150,
    },
    // Bỏ cột Members
    {
      title: 'Cost',
      dataIndex: 'cost',
      key: 'cost',
      width: 150,
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      width: 150,
      render: (progress: number) => (
        <Progress percent={progress} format={percent => `${percent}%`} />
      ),
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text) => moment(text).format('YYYY-MM-DD'),
      width: 150,
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text) => moment(text).format('YYYY-MM-DD'),
      width: 150,
    },
    {
      title: (
        <div style={{ textAlign: 'center' }}>
          <div>Actions</div>
        </div>
      ),
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleUpdate(record)} />
          <Button type="text" icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} />
        </Space>
      ),
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <AppLayout activeMenuKey="/projects">
      <Card
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: "32px" }}>List Projects</span>
            <PlusOutlined
              style={{ fontSize: 24, cursor: "pointer" }}
              onClick={handleCreate}
            />
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={projects}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
        />
        <Modal
          title={modalType === "create" ? "Create Project" : "Update Project"}
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Form.Item name="projectName" label="Project Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
              <Select>
                <Option value="ongoing">Ongoing</Option>
                <Option value="completed">Completed</Option>
                <Option value="pending">Pending</Option>
              </Select>
            </Form.Item>
            <Form.Item name="leader" label="Leader" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            {/* Removed Members field */}
            <Form.Item name="cost" label="Cost" rules={[{ required: true }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item name="progress" label="Progress" rules={[{ required: true }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item name="startDate" label="Start Date" rules={[{ required: true }]}>
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item name="endDate" label="End Date" rules={[{ required: true }]}>
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {modalType === "create" ? "Create" : "Update"}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </AppLayout>
  );
}
