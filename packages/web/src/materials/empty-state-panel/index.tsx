import { Button, Empty, Space, Typography } from "antd";

const { Text } = Typography;

function EmptyStatePanelDemo() {
  return (
    <Space
      direction="vertical"
      size={14}
      align="center"
      style={{
        width: "100%",
        maxWidth: 520,
        padding: "36px 16px",
        border: "1px dashed #d9d9d9",
        borderRadius: 14,
        background: "#fff",
      }}
    >
      <Empty description="当前暂无数据" />
      <Text type="secondary">你可以先创建第一条记录，系统会在此自动展示。</Text>
      <Button type="primary">立即创建</Button>
    </Space>
  );
}

export default EmptyStatePanelDemo;
