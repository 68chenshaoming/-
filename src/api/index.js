import request from "./request";

export const login = query => {
	return request({
		method: "get",
		url: "/login",
		params: query,
	});
};

export const getUserList = query => {
	return request({
		method: "get",
		url: "users",
		params: query,
	});
};

export const addUsers = params => {
	return request({
		method: "post",
		url: "users",
		data: params,
	});
};

export const changeState = (id, state) => {
	return request({
		method: "put",
		url: `users/${id}/state/${state}`,
	});
};

export const editUserInfo = (id, params) => {
	return request({
		method: "put",
		url: `users/${id}`,
		data: params,
	});
};

export const delUserInfo = id => {
	return request({
		method: "delete",
		url: `users/${id}`,
	});
};

export const getRoleList = () => {
	return request({
		method: "get",
		url: `roles`,
	});
};

export const putRole = (id, roleId) => {
	return request({
		method: "put",
		url: `users/${id}/role`,
		data: roleId,
	});
};

export const addRole = params => {
	return request({
		method: "post",
		url: "roles",
		data: params,
	});
};

export const delRole = id => {
	return request({
		method: "delete",
		url: `roles/${id}`,
	});
};

export const editRole = (id, params) => {
	return request({
		method: "put",
		url: `roles/${id}`,
		data: params,
	});
};

export const delRoleById = (roleId, rightId) => {
	return request({
		method: "delete",
		url: `roles/${roleId}/rights/${rightId}`,
	});
};

export const getRight = type => {
	return request({
		method: "get",
		url: `rights/${type}`,
	});
};

export const getRightById = (roleId, params) => {
	return request({
		method: "post",
		url: `roles/${roleId}/rights`,
		data: params,
	});
};

export const getGoodsList = query => {
	return request({
		method: "get",
		url: `goods`,
		params: query,
	});
};
export const getCateList = query => {
	return request({
		method: "get",
		url: `categories`,
		params: query,
	});
};

export const getCateAttr = (id, query) => {
	return request({
		method: "get",
		url: `categories/${id}/attributes`,
		params: query,
	});
};

export const postGoods = params => {
	return request({
		method: "post",
		url: `goods`,
		data: params,
	});
};

export const postAttrs = (id, params) => {
	return request({
		method: "post",
		url: `categories/${id}/attributes`,
		data: params,
	});
};

export const getCateAttrById = (id, attrId, query) => {
	return request({
		method: "get",
		url: `categories/${id}/attributes/${attrId}`,
		params: query,
	});
};
export const putCateAttrById = (id, attrId, params) => {
	return request({
		method: "put",
		url: `categories/${id}/attributes/${attrId}`,
		data: params,
	});
};

export const deleteCateAttrById = (id, attrid) => {
	return request({
		method: "delete",
		url: `categories/${id}/attributes/${attrid}`,
	});
};
export const getGoods = query => {
	return request({
		method: "get",
		url: `goods`,
		params: query,
	});
};

export const delGoodsById = id => {
	return request({
		method: "delete",
		url: `goods/${id}`,
	});
};

export const addCatePost = params => {
	return request({
		method: "post",
		url: `categories`,
		data: params,
	});
};
