import React from "react";
import clsx from "clsx";
import { useMediaQuery } from "react-responsive";
import { Row, Col, Typography, Badge, theme } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";

import "./style.css";

const { Title } = Typography;

const StepWraper = ({
  active,
  stepTitle,
  stepNumber,
  done,
  children,
  isContentBlock = false,
}) => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1080px)",
  });
  const {
    token: { colorPalette1 },
  } = theme.useToken();

  const cx = clsx("step-wrapper", {
    active: active,
    isDesktop: isDesktopOrLaptop,
  });
  return (
    <div className={cx}>
      <Row style={{ width: "100%" }}>
        <Col xs={{ span: 3 }} md={{ span: 1 }}>
          <Badge
            className={clsx("step-wraper-badge", {
              "step-wraper-badge-active": active,
            })}
            count={stepNumber}
            showZero
          />
        </Col>

        <Col xs={{ span: 19 }} md={{ span: 22 }}>
          <div
            className={clsx("step-wraper-title-children", {
              block: isContentBlock,
            })}
          >
            {stepTitle && (
              <div className="title-section">
                <Title
                  className={clsx("step-wraper-title", {
                    "step-wraper-title-active": active,
                    "step-wraper-title-done": done,
                  })}
                  level={4}
                >
                  {stepTitle}
                </Title>
              </div>
            )}
            {active && <div className="children-section">{children}</div>}
          </div>
        </Col>

        {done && (
          <Col xs={{ span: 2 }} md={{ span: 1 }}>
            <CheckCircleFilled
              style={{ fontSize: "28px", color: colorPalette1 }}
            />
          </Col>
        )}
      </Row>
    </div>
  );
};

export default StepWraper;
