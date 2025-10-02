import java.util.Map;
import java.util.HashMap;

public class Parser {

    public static void main(String[] args) {
        System.out.println(parse("http://localhost:5001/login?email=bob&pass=1234").get("pass"));
    }
    
    /**
     * Parses a URL and returns a map of the query parameters.
     * @param input The URL to parse.
     * @return A map of the query parameters.
     */
    public static Map <String, String> parse(String input) {
        Map<String, String> output = new HashMap<String, String>();
        String[] parts = input.split("\\?");
        String[] params = parts[1].split("&");
        String[][] keyValue = new String[params.length][2];
        for(int i = 0; i < params.length; i++) {
            keyValue[i] = params[i].split("=");
            //System.out.println(params[i]);
        }
        for(int i = 0; i < keyValue.length; i++) {
            //System.out.println(keyValue[i][0]);
            //System.out.println(keyValue[i][1]);
            output.put(keyValue[i][0], keyValue[i][1]);
        }
        return output;
    }

}
