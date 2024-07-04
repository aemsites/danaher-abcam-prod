import { getProductResponse } from "../../scripts/search.js";

export default async function decorate(block) {
    const response = await getProductResponse();
    block.textContent = 'Product Target Data Placeholder';
}