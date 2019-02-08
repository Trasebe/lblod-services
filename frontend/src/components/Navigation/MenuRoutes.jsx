/* eslint-disable */
import React from "react";

import { Icon, Menu } from "antd";
import { Link } from "react-router-dom";

const { Item, SubMenu } = Menu;

const MenuRoutes = () => (
  <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
    {/* ==================
        Query
    ================== */}
    <Item key="home">
      <Icon type="question-circle-o" />
      <span>SPARQL resources</span>
      <Link to="/" />
    </Item>

    <Item key="query">
      <Icon type="question-circle-o" />
      <span>BC resources</span>
      <Link to="/decisions" />
    </Item>

    <Item key="validate">
      <Icon type="question-circle-o" />
      <span>Validation</span>
      <Link to="/validate" />
    </Item>
    <Item key="testing">
      <Icon type="question-circle-o" />
      <span>Testing</span>
      <Link to="/testing" />
    </Item>
  </Menu>
);

export default MenuRoutes;
