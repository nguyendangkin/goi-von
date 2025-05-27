"use client";

import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Flex, notification } from "antd";
import { Typography } from "antd";
import { signIn } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";
import { authenticate } from "@/actions/actions";
import { useRouter } from "next/navigation";

const { Title } = Typography;

export default function RegisterUi() {
    const router = useRouter();
    const onFinish = async (values: any) => {
        const data = await authenticate(values);
        console.log("data", data);
        if (data?.error) {
            if (data?.code === 2) {
                router.push("/verify");
            }
            notification.error({
                message: "Lỗi đăng nhập",
                description: data.error,
            });
        } else {
            router.push("/");
        }
    };

    return (
        <Flex justify="center" align="center" style={{ height: "100vh" }}>
            <Form
                name="login"
                initialValues={{ remember: true }}
                style={{ width: "80%", maxWidth: "400px" }}
                onFinish={onFinish}
            >
                <Title level={3}>Đăng Ký</Title>
                <Form.Item
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập Email của bạn!",
                        },
                    ]}
                >
                    <Input prefix={<UserOutlined />} placeholder="Email" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập Mật khẩu của bạn!",
                        },
                    ]}
                >
                    <Input
                        prefix={<LockOutlined />}
                        type="password"
                        placeholder="Mật khẩu"
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập Mật khẩu của bạn!",
                        },
                    ]}
                >
                    <Input
                        prefix={<LockOutlined />}
                        type="password"
                        placeholder="Mật khẩu"
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập Mật khẩu của bạn!",
                        },
                    ]}
                >
                    <Input
                        prefix={<LockOutlined />}
                        type="password"
                        placeholder="Mật khẩu"
                    />
                </Form.Item>
                <Form.Item>
                    <Flex justify="space-between" align="center">
                        <a href="">Quên mật khẩu</a>
                    </Flex>
                </Form.Item>

                <Form.Item>
                    <Button block type="primary" htmlType="submit">
                        Đăng nhập
                    </Button>
                    hoặc <a href="">Đăng nhập ngay bây giờ!</a>
                </Form.Item>
            </Form>
        </Flex>
    );
}
