import { Button, Flex } from "antd";

export default function Home() {
    return (
        <div>
            <Flex gap="small" wrap>
                <Button type="primary">Xin chào Button</Button>
                <Button>Default Button</Button>
                <Button type="dashed">Dashed Button</Button>
                <Button type="text">Text Button</Button>
                <Button type="link">Link Button</Button>
            </Flex>
        </div>
    );
}
