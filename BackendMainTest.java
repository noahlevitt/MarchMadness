import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import java.io.*;
import java.net.*;
import java.sql.Connection;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.Headers;

class BackendMainTest {

    @Test
    void testReceiveQuery() {
        // Simulate user input
        String simulatedInput = "SELECT * FROM users;";
        InputStream originalSystemIn = System.in;
        System.setIn(new ByteArrayInputStream(simulatedInput.getBytes()));

        String query = BackendMain.receiveQuery(); // Call method

        // Reset System.in
        System.setIn(originalSystemIn);

        assertEquals("SELECT * FROM users;", query);
    }

    @Test
    void testExeSelectThrowsException() {
        // Expect a NullPointerException because the method accesses a null connection
        assertThrows(NullPointerException.class, () ->
            BackendMain.exeSelect("SELECT * FROM users", (Connection) null));
    }

    @Test
    void testExeUpdateThrowsException() {
        // Expect a NullPointerException because the method accesses a null connection
        assertThrows(NullPointerException.class, () ->
            BackendMain.exeUpdate("UPDATE users SET name='John' WHERE id=1", (Connection) null));
    }

    @Test
    void testExecuteQueryInvalid() {
        // Without a proper DB driver, any query should result in an error message.
        String result = BackendMain.executeQuery("INVALID QUERY");
        assertTrue(result.startsWith("SQL Error:"), 
                   "executeQuery should return an error message for an invalid query");
    }

    @Test
    void testQueryHandlerOptionsMethod() throws Exception {
        DummyHttpExchange exchange = new DummyHttpExchange("OPTIONS", "/query?dummy=test");
        BackendMain.QueryHandler handler = new BackendMain.QueryHandler();
        handler.handle(exchange);
        assertEquals(204, exchange.getResponseCode(), 
                     "OPTIONS method should return status code 204");
    }

    @Test
    void testQueryHandlerGetMethod() throws Exception {
        // Use a properly encoded URI for the GET test.
        DummyHttpExchange exchange = new DummyHttpExchange("GET", "/query?query=INVALID%20QUERY");
        BackendMain.QueryHandler handler = new BackendMain.QueryHandler();
        handler.handle(exchange);
        String response = exchange.getResponse();
        assertTrue(response.startsWith("SQL Error:"), 
                   "GET method with invalid query should return SQL error message");
        assertEquals(200, exchange.getResponseCode(), 
                     "GET method should return status code 200");
    }

    @Test
    void testQueryHandlerPostMethod() throws Exception {
        DummyHttpExchange exchange = new DummyHttpExchange("POST", "/query?query=anything");
        BackendMain.QueryHandler handler = new BackendMain.QueryHandler();
        handler.handle(exchange);
        assertEquals(405, exchange.getResponseCode(), 
                     "POST method should return status code 405");
    }

    // DummyHttpExchange simulates an HttpExchange for testing QueryHandler.
    static class DummyHttpExchange extends HttpExchange {
        private final String method;
        private final URI requestURI;
        private final Headers requestHeaders = new Headers();
        private final Headers responseHeaders = new Headers();
        private final ByteArrayOutputStream responseBody = new ByteArrayOutputStream();
        private int responseCode;

        public DummyHttpExchange(String method, String uriStr) {
            this.method = method;
            this.requestURI = URI.create(uriStr);
        }

        @Override
        public Headers getRequestHeaders() {
            return requestHeaders;
        }

        @Override
        public Headers getResponseHeaders() {
            return responseHeaders;
        }

        @Override
        public URI getRequestURI() {
            return requestURI;
        }

        @Override
        public String getRequestMethod() {
            return method;
        }

        @Override
        public com.sun.net.httpserver.HttpContext getHttpContext() {
            return null;
        }

        @Override
        public void close() { }

        @Override
        public InputStream getRequestBody() {
            return new ByteArrayInputStream(new byte[0]);
        }

        @Override
        public OutputStream getResponseBody() {
            return responseBody;
        }

        @Override
        public void sendResponseHeaders(int rCode, long responseLength) {
            this.responseCode = rCode;
        }

        @Override
        public InetSocketAddress getRemoteAddress() {
            return new InetSocketAddress(0);
        }

        @Override
        public InetSocketAddress getLocalAddress() {
            return new InetSocketAddress(0);
        }

        @Override
        public String getProtocol() {
            return "HTTP/1.1";
        }

        @Override
        public Object getAttribute(String name) {
            return null;
        }

        @Override
        public void setAttribute(String name, Object value) { }

        @Override
        public void setStreams(InputStream i, OutputStream o) { }

        @Override
        public com.sun.net.httpserver.HttpPrincipal getPrincipal() {
            return null;
        }

        public int getResponseCode() {
            return responseCode;
        }

        public String getResponse() {
            return responseBody.toString();
        }
    }
}

