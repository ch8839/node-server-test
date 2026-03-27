import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Space, Statistic, Tag, Typography } from "antd";

const { Text } = Typography;

function StatsKpiCardDemo() {
  return (
    <Card style={{ width: 360, borderRadius: 14 }}>
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        <Space style={{ justifyContent: "space-between", width: "100%" }}>
          <Text type="secondary">本周活跃用户</Text>
          <Tag color="blue">核心指标</Tag>
        </Space>
        <Statistic value={18249} suffix="人" />
        <Space size={14}>
          <Text style={{ color: "#16a34a" }}>
            <ArrowUpOutlined /> +12.8%
          </Text>
          <Text type="secondary">较上周</Text>
          <Text style={{ color: "#ef4444" }}>
            <ArrowDownOutlined /> -2.1%
          </Text>
        </Space>
      </Space>
    </Card>
  );
}

export default StatsKpiCardDemo;
