"use client";

import {
  getResources,
  createResource,
  updateResource,
  deleteResource,
} from "@/api/resourceAPI";
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
  Tabs,
} from "antd";
import type { TableProps } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import AppLayout from "@/components/layout";
import moment from "moment";
import ProjectTeam from "@/components/ProjectTeam";

const { Option } = Select;
const { TabPane } = Tabs;

interface Resource {
  _id: string;
  name: string;
  dateOfBirth: string;
  sex: string;
  account: string;
  status: string;
  phoneNumber: string;
  identityCard: string;
  email: string;
  contract: string;
  startDate: string;
  endDate: string;
  projects: string[];
}

// Define color and border functions
const getColor = (value: string, type: string) => {
  switch (type) {
    case "sex":
      return value === "Male" ? "cyan" : "violet";
    case "status":
      return value === "active" ? "lime" : "red";
    case "contract":
      return value === "Probation"
        ? "purple"
        : value === "Internship"
        ? "orange"
        : "green";
    default:
      return "transparent";
  }
};

const getBorderColor = (color: string) => {
  return `1px solid ${color}`;
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"create" | "update">("create");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  const [form] = Form.useForm();
  const [activeTabKey, setActiveTabKey] = useState("1"); // State to manage active tab

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resourcesData = await getResources();
        setResources(resourcesData);
      } catch (error) {
        console.error("Error fetching resources:", error);
        setError("Failed to load resources.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this resource?",
      content: "This action cannot be undone.",
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteResource(id);
          setResources(resources.filter((resource) => resource._id !== id));
          message.success("Resource deleted successfully.");
        } catch (error) {
          console.error("Error deleting resource:", error);
          message.error("Failed to delete resource.");
        }
      },
    });
  };

  const handleCreate = () => {
    setModalType("create");
    setSelectedResource(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleUpdate = (resource: Resource) => {
    setModalType("update");
    setSelectedResource(resource);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...resource,
      dateOfBirth: moment(resource.dateOfBirth),
      startDate: moment(resource.startDate),
      endDate: moment(resource.endDate),
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      // Giữ nguyên trường projects chỉ khi nó không rỗng
      const updatedData =
        modalType === "update" &&
        selectedResource &&
        selectedResource.projects.length > 0
          ? { ...values, projects: selectedResource.projects }
          : values;

      if (modalType === "create") {
        await createResource(updatedData);
        message.success("Resource created successfully.");
      } else if (modalType === "update" && selectedResource) {
        await updateResource(selectedResource._id, updatedData);
        message.success("Resource updated successfully.");
      }

      const resourcesData = await getResources();
      setResources(resourcesData);
      setIsModalVisible(false);
    } catch (error) {
      console.error(
        `Error ${modalType === "create" ? "creating" : "updating"} resource:`,
        error
      );
      message.error(
        `Failed to ${modalType === "create" ? "create" : "update"} resource.`
      );
    }
  };

  const columns: TableProps<Resource>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      render: (text) => moment(text).format("YYYY-MM-DD"),
      width: 130,
    },
    {
      title: "Sex",
      dataIndex: "sex",
      key: "sex",
      width: 100,
      render: (text) => (
        <div
          style={{
            backgroundColor: getColor(text, "sex"),
            border: getBorderColor(getColor(text, "sex")),
            padding: "4px 8px",
            borderRadius: "4px",
            color: "white",
            textAlign: "center",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Account",
      dataIndex: "account",
      key: "account",
      width: 170,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (text) => (
        <div
          style={{
            backgroundColor: getColor(text, "status"),
            border: getBorderColor(getColor(text, "status")),
            padding: "4px 8px",
            borderRadius: "4px",
            color: "white",
            textAlign: "center",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 150,
    },
    {
      title: "Identity Card",
      dataIndex: "identityCard",
      key: "identityCard",
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
    },
    {
      title: "Contract",
      dataIndex: "contract",
      key: "contract",
      width: 150,
      render: (text) => (
        <div
          style={{
            backgroundColor: getColor(text, "contract"),
            border: getBorderColor(getColor(text, "contract")),
            padding: "4px 8px",
            borderRadius: "4px",
            color: "white",
            textAlign: "center",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (text) => moment(text).format("YYYY-MM-DD"),
      width: 150,
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (text) => moment(text).format("YYYY-MM-DD"),
      width: 150,
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          <div>Actions</div>
        </div>
      ),
      key: "actions",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleUpdate(record)}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      ),
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <AppLayout activeMenuKey="/resources">
      <Card
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Tabs
              defaultActiveKey="1"
              onChange={(key) => setActiveTabKey(key)}
              tabBarExtraContent={activeTabKey === "1"}
            >
              <TabPane tab="Resource List" key="1" />
              <TabPane tab="Project Team" key="2" />
            </Tabs>
            <Button icon={<PlusOutlined />} onClick={handleCreate}>
            </Button>
          </div>
        }
        bordered
      >
        {activeTabKey === "1" && (
          <Table
            columns={columns}
            dataSource={resources}
            rowKey="_id"
            scroll={{ x: 1500 }}
          />
        )}
        {/* Placeholder for the second tab */}
        {activeTabKey === "2" && <ProjectTeam/>}
      </Card>

      <Modal
        title={modalType === "create" ? "Create Resource" : "Update Resource"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{}}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input the resource's name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="dateOfBirth"
            label="Date of Birth"
            rules={[{ required: true, message: "Please select the date of birth!" }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            name="sex"
            label="Sex"
            rules={[{ required: true, message: "Please select the sex!" }]}
          >
            <Select>
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="account"
            label="Account"
            rules={[{ required: true, message: "Please input the account number!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select the status!" }]}
          >
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[{ required: true, message: "Please input the phone number!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="identityCard"
            label="Identity Card"
            rules={[{ required: true, message: "Please input the identity card number!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please input the email!" }]}
          >
            <Input type="email" />
          </Form.Item>

          <Form.Item
            name="contract"
            label="Contract"
            rules={[{ required: true, message: "Please select the contract type!" }]}
          >
            <Select>
              <Option value="Probation">Probation</Option>
              <Option value="Internship">Internship</Option>
              <Option value="Official">Official</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="startDate"
            label="Start Date"
            rules={[{ required: true, message: "Please select the start date!" }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ required: true, message: "Please select the end date!" }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {modalType === "create" ? "Create" : "Update"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </AppLayout>
  );
}
