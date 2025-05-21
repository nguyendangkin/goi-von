"use client";

import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Flex } from "antd";

const LoginUi: React.FC = () => {
    const onFinish = (values: any) => {
        console.log("Received values of form: ", values);
    };

    return (
        <Flex justify="center" align="center" style={{ height: "100vh" }}>
            <Form
                name="login"
                initialValues={{ remember: true }}
                style={{ width: "80%", maxWidth: "400px" }}
                onFinish={onFinish}
            >
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
                <Form.Item>
                    <Flex justify="space-between" align="center">
                        <a href="">Quên mật khẩu</a>
                    </Flex>
                </Form.Item>

                <Form.Item>
                    <Button block type="primary" htmlType="submit">
                        Đăng nhập
                    </Button>
                    hoặc <a href="">Đăng ký ngay bây giờ!</a>
                </Form.Item>
            </Form>
        </Flex>
    );
};

export default LoginUi;
